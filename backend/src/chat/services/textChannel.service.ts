import {
  Injectable,
  HttpException,
  HttpStatus,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { MutedUser } from '../entities/mute.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordI } from '../interfaces/password.interface';
import { BannedUser } from '../entities/banned.entity';
import { Log } from '../entities/log.entity';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/services/user.service';
import { TextChannel } from '../entities/textChannel.entity';

const temporary = 30 * 60 * 1000;

@Injectable()
export class TextChannelService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @InjectRepository(TextChannel)
    private readonly textChannelRepository: Repository<TextChannel>,

    @InjectRepository(MutedUser)
    private readonly mutedUserRepository: Repository<MutedUser>,

    @InjectRepository(BannedUser)
    private readonly bannedUserRepository: Repository<BannedUser>,

    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  async getChannel(
    channelId: number,
    relations = [] as string[],
    needPass?: boolean,
  ): Promise<TextChannel> {
    let channel = null;
    if (channelId)
      channel = await this.textChannelRepository.findOne(channelId, {
        relations,
      });
    if (!channel)
      throw new HttpException('TextChannel not found', HttpStatus.NOT_FOUND);

    if (!needPass) delete channel.password;
    return channel;
  }

  async createChannel(
    channel: TextChannel,
    userId: number,
  ): Promise<TextChannel> {
    const admin = await this.userService.getUser(userId);
    if (channel.name == undefined)
      throw new HttpException(
        'TextChannel name needs to be specified',
        HttpStatus.FORBIDDEN,
      );

    let hashedPassword = null;
    if (channel.public == false) {
      {
        if (!channel.password)
          throw new HttpException('Password Required', HttpStatus.FORBIDDEN);

        if (channel.password.length > 16)
          throw new HttpException(
            'New password too long',
            HttpStatus.FORBIDDEN,
          );
      }

      try {
        hashedPassword = await bcrypt.hash(String(channel.password), 10);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
    if (
      await this.textChannelRepository.findOne({
        where: { name: channel.name },
      })
    )
      throw new HttpException(
        'TextChannel already exists',
        HttpStatus.FORBIDDEN,
      );
    const currentChannel = this.textChannelRepository.create({
      name: channel.name,
      adminId: [admin.id],
      public: channel.public !== false,
      owner: admin,
      users: [admin],
      muted: [],
      password: hashedPassword,
    });

    try {
      await this.textChannelRepository.save(currentChannel);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    delete currentChannel.password;
    return currentChannel;
  }

  async deleteChannel(id: number): Promise<void> {
    const channel = await this.getChannel(id, [
      'users',
      'muted',
      'banned',
      'logs',
    ]);

    await this.logRepository.remove(channel.logs);
    await this.mutedUserRepository.remove(channel.muted);
    await this.bannedUserRepository.remove(channel.banned);
    await this.textChannelRepository.remove(channel);
  }

  async removeUserFromChannel(
    userId: number,
    channelId: number,
    adminId?: number,
  ): Promise<void> {
    const user = await this.userService.getUser(userId);
    const channel = await this.getChannel(channelId, ['users']);

    if (adminId && adminId != user.id) {
      if (channel.adminId.indexOf(adminId) == -1)
        throw new HttpException(
          'User isnt admin in channel',
          HttpStatus.FORBIDDEN,
        );

      if (user.id == channel.owner.id)
        throw new HttpException('Cannot kick an owner', HttpStatus.FORBIDDEN);

      const index = channel.adminId.indexOf(user.id);
      if (index != -1) channel.adminId.splice(index, 1);
    } else if (user.id == channel.owner.id)
      return await this.deleteChannel(channel.id);

    {
      const index = channel.users.findIndex((user1) => user1.id == user.id);
      if (index == -1)
        throw new HttpException('User not in channel', HttpStatus.NOT_FOUND);
      channel.users.splice(index, 1);
    }

    try {
      await this.textChannelRepository.save(channel);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async changePassword(
    pass: PasswordI,
    channelId: number,
    userId: number,
  ): Promise<void> {
    if (pass.newPassword.length > 16)
      throw new HttpException('New password too long', HttpStatus.FORBIDDEN);
    const user = await this.userService.getUser(userId);
    const channel = await this.getChannel(channelId);

    if (channel.public == true)
      throw new HttpException('TextChannel is public', HttpStatus.FORBIDDEN);
    if (channel.owner.id != user.id)
      throw new HttpException(
        "User isn't the channel's owner",
        HttpStatus.FORBIDDEN,
      );
    if (!pass.newPassword)
      throw new HttpException(
        'New password cannot be empty',
        HttpStatus.FORBIDDEN,
      );

    if (!(await this.checkPassword(channel.id, pass.oldPassword)))
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.FORBIDDEN,
      );

    try {
      const password = await bcrypt.hash(pass.newPassword, 10);
      await this.textChannelRepository.update(channel.id, { password });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async checkPassword(id: number, password: string): Promise<boolean> {
    if (!password) return false;

    const currentChannel = await this.getChannel(id, [], true);
    if (!currentChannel) return false;

    return await bcrypt.compare(password, currentChannel.password);
  }

  async updateChannel(
    id: number,
    channel: TextChannel,
    userId: number,
  ): Promise<void> {
    {
      const user = await this.userService.getUser(userId);
      const updatedChannel = await this.getChannel(id);
      if (updatedChannel.owner.id != user.id)
        throw new HttpException(
          'User isnt owner of TextChannel',
          HttpStatus.FORBIDDEN,
        );
    }

    const partial: TextChannel = {
      public: channel.public !== false,
    } as TextChannel;

    if (channel.name) partial.name = channel.name;

    if (channel.hasOwnProperty('public')) {
      partial.public = channel.public !== false;
      if (partial.public) partial.password = null;
      else {
        if (!channel.password)
          throw new HttpException('Password Required', HttpStatus.FORBIDDEN);

        try {
          partial.password = await bcrypt.hash(String(channel.password), 10);
        } catch (error) {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
      }
    }

    try {
      await this.textChannelRepository.update(channel.id, partial);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllChannels(): Promise<TextChannel[]> {
    const channels = await this.textChannelRepository.find();
    channels.forEach((chat) => delete chat.password);
    return channels;
  }

  async getChannelsForUser(userId: number): Promise<TextChannel[]> {
    const uncompleted: TextChannel[] = await this.textChannelRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.users', 'user')
      .where('user.id = :userId', { userId })
      .getMany();

    const unresolved: Promise<TextChannel>[] = uncompleted.map((channel) =>
      this.getChannel(channel.id, ['users', 'muted', 'banned', 'logs']),
    );
    return await Promise.all(unresolved);
  }

  async addUserToChannel(channel: TextChannel, userId: number): Promise<void> {
    const user = await this.userService.getUser(userId);
    const curchannel = await this.getChannel(
      channel.id,
      ['users', 'banned'],
      true,
    );
    if (!curchannel.public)
      if (
        channel.password == undefined ||
        !(await bcrypt.compare(channel.password, curchannel.password))
      )
        throw new HttpException('Incorrect password', HttpStatus.FORBIDDEN);

    for (const banned of curchannel.banned)
      if (banned.user.id == user.id) {
        const time = new Date();
        if (banned.endOfBan > time)
          throw new HttpException(
            'User is banned from TextChannel',
            HttpStatus.FORBIDDEN,
          );
        await this.unBanUserInChannel(banned, curchannel);
      }

    if (curchannel.users.find((user1) => user1.id == user.id))
      throw new HttpException('User already in channel', HttpStatus.CONFLICT);

    await this.textChannelRepository
      .createQueryBuilder()
      .relation(TextChannel, 'users')
      .of(curchannel)
      .add(user);
  }

  async toggleAdminRole(
    ownerId: number,
    userId: number,
    channelid: number,
  ): Promise<void> {
    const owner = await this.userService.getUser(ownerId);
    const user = await this.userService.getUser(userId);
    const channel = await this.getChannel(channelid, ['users']);
    if (channel.owner.id != owner.id)
      throw new HttpException(
        "User isn't the channel's owner",
        HttpStatus.FORBIDDEN,
      );

    if (user.id == channel.owner.id)
      throw new HttpException('Owner cannot be demoted', HttpStatus.FORBIDDEN);

    if (!channel.users.find((user1) => user1.id == user.id))
      throw new HttpException(
        "User getting promoted isn't part of the channel",
        HttpStatus.FORBIDDEN,
      );

    {
      const index = channel.adminId.indexOf(user.id);
      if (index == -1) channel.adminId.push(user.id);
      else channel.adminId.splice(index, 1);
    }

    try {
      await this.textChannelRepository.save(channel);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async unBanUserInChannel(
    user: BannedUser,
    channel: TextChannel,
  ): Promise<void> {
    const index = channel.banned.findIndex((user1) => user1.id == user.id);
    if (index == -1) return;

    await this.bannedUserRepository.delete(user.id);
  }

  async unMuteUserInChannel(
    user: MutedUser,
    channel: TextChannel,
  ): Promise<void> {
    const index = channel.muted.findIndex((user1) => user1.id == user.id);
    if (index == -1) return;

    await this.mutedUserRepository.delete(user.id);
  }

  async muteUserInChannel(
    userId: number,
    channelid: number,
    adminId: number,
  ): Promise<void> {
    const user = await this.userService.getUser(userId);
    const admin = await this.userService.getUser(adminId);
    const currentChannel = await this.getChannel(channelid, ['users', 'muted']);
    if (currentChannel.owner.id == user.id)
      throw new HttpException(
        'User is owner and thus cannot be muted',
        HttpStatus.FORBIDDEN,
      );

    if (!currentChannel.users.find((user1) => user1.id == user.id))
      throw new HttpException('User isnt in channel', HttpStatus.NOT_FOUND);

    if (!currentChannel.adminId.find((adminId) => adminId == admin.id))
      throw new HttpException(
        'User isnt admin in channel',
        HttpStatus.FORBIDDEN,
      );

    if (currentChannel.muted.find((user1) => user1.user.id == user.id))
      throw new HttpException('User is already muted', HttpStatus.FORBIDDEN);

    const time = new Date(Date.now() + temporary);
    const muted = this.mutedUserRepository.create({
      user,
      endOfMute: time,
      channel: currentChannel,
    });

    try {
      await this.mutedUserRepository.save(muted);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async banUserInChannel(
    userId: number,
    channelid: number,
    adminId: number,
  ): Promise<void> {
    const admin = await this.userService.getUser(adminId);
    const user = await this.userService.getUser(userId);
    const currentChannel = await this.getChannel(channelid, [
      'users',
      'banned',
    ]);
    if (currentChannel.owner.id == user.id)
      throw new HttpException(
        'User is owner and thus cannot be banned',
        HttpStatus.FORBIDDEN,
      );

    if (!currentChannel.users.find((user1) => user1.id == user.id))
      throw new HttpException('User isnt in channel', HttpStatus.NOT_FOUND);

    if (!currentChannel.adminId.find((adminId) => adminId == admin.id))
      throw new HttpException(
        'User isnt admin in channel',
        HttpStatus.FORBIDDEN,
      );

    if (currentChannel.banned.find((user1) => user1.user.id == user.id))
      throw new HttpException('User is already banned', HttpStatus.FORBIDDEN);

    const time = new Date(Date.now() + temporary);
    const banned = this.bannedUserRepository.create({
      user,
      endOfBan: time,
      channel: currentChannel,
    });

    currentChannel.users.splice(
      currentChannel.users.findIndex((user1) => user1.id == user.id),
      1,
    );

    try {
      await this.textChannelRepository.save(currentChannel);
      await this.bannedUserRepository.save(banned);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async addLogForChannel(
    id: number,
    message: string,
    userId: number,
  ): Promise<void> {
    const user = await this.userService.getUser(userId);
    const currentChannel = await this.getChannel(id, [
      'users',
      'logs',
      'muted',
    ]);
    if (!currentChannel.users.find((user1) => user1.id == user.id))
      throw new HttpException('User isnt in channel', HttpStatus.NOT_FOUND);

    {
      const muted = currentChannel.muted.find(
        (user1) => user1.user.id == user.id,
      );
      if (muted) {
        const time = new Date();
        if (muted.endOfMute > time)
          throw new HttpException(
            'User is muted from TextChannel',
            HttpStatus.FORBIDDEN,
          );
        await this.unMuteUserInChannel(muted, currentChannel);
      }
    }

    const log = this.logRepository.create({
      message: message,
      user: user,
    });

    try {
      await this.logRepository.save(log);
      await this.textChannelRepository
        .createQueryBuilder()
        .relation(TextChannel, 'logs')
        .of(currentChannel)
        .add(log);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getLogsForChannel(id: number, userId: number): Promise<Log[]> {
    const user = await this.userService.getUser(userId);
    const currentChannel = await this.getChannel(id, ['logs']);
    const logs = [];
    for (const log of currentChannel.logs) {
      if (user.blocked.indexOf(log.user.id) == -1) logs.push(log);
    }
    return logs;
  }
}
