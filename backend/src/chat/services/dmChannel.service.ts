import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/services/user.service';
import { DMChannel } from '../entities/dmChannel.entity';
import { User } from 'src/user/entities/user.entity';
import { Log } from '../entities/log.entity';

@Injectable()
export class DMChannelService {
  constructor(
    private readonly userService: UserService,

    @InjectRepository(DMChannel)
    private readonly dmChannelRepository: Repository<DMChannel>,

    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  async getChannel(
    channelId: number,
    relations = [] as string[],
    needPass?: boolean,
  ): Promise<DMChannel> {
    let channel = null;
    if (channelId)
      channel = await this.dmChannelRepository.findOne(channelId, {
        relations,
      });
    if (!channel)
      throw new HttpException('TextChannel not found', HttpStatus.NOT_FOUND);

    if (!needPass) delete channel.password;
    return channel;
  }

  async getChannels(userId: number): Promise<DMChannel[]> {
    const uncompleted: DMChannel[] = await this.dmChannelRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.users', 'user')
      .where('user.id = :userId', { userId })
      .getMany();

    const unresolved: Promise<DMChannel>[] = uncompleted.map((channel) =>
      this.getChannel(channel.id, ['users', 'logs']),
    );
    return await Promise.all(unresolved);
  }

  async createChannel(users: User[]): Promise<DMChannel> {
    if (users.length > 2)
      throw new HttpException(
        'Too many users in Channel',
        HttpStatus.NOT_ACCEPTABLE,
      );
    const channel = this.dmChannelRepository.create({ users });

    try {
      await this.dmChannelRepository.save(channel);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return channel;
  }

  async deleteChannel(channelId: number): Promise<void> {
    const channel = await this.getChannel(channelId, ['logs']);
    try {
      await this.logRepository.remove(channel.logs);
      await this.dmChannelRepository.delete(channel.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createMessage(
    channelId: number,
    userId: number,
    text: string,
  ): Promise<Log> {
    const channel = await this.getChannel(channelId, ['logs', 'users']);
    const user = await this.userService.getUser(userId);

    if (!channel.users.some(user => user.id == userId))
      throw new HttpException('User not in channel', HttpStatus.NOT_FOUND);

    const log = this.logRepository.create({ message: text, user });
    channel.logs.push(log);

    try {
      await this.logRepository.save(log);
      await this.dmChannelRepository.update(channel.id, { logs: channel.logs });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return log;
  }

  async joinChannel(userId: number, targetId: number): Promise<DMChannel> {
    if (userId == targetId)
      throw new HttpException('User cannot be the same', HttpStatus.FORBIDDEN);
    const user = await this.userService.getUser(userId);
    const target = await this.userService.getUser(targetId);
    return await this.createChannel([user, target]);
  }
}
