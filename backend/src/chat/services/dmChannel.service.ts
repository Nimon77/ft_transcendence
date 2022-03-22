import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DMChannel } from '../entities/dmChannel.entity';
import { User } from 'src/user/entities/user.entity';
import { Log } from '../entities/log.entity';

@Injectable()
export class DMChannelService {
  constructor(
    @InjectRepository(DMChannel)
    private readonly dmChannelRepository: Repository<DMChannel>,

    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  async getChannel(
    //yes
    channelId: number,
    relations: string[],
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

  async createMessage(channelId: number, text: string): Promise<void> {
    const channel = await this.getChannel(channelId, ['logs']);

    const log = this.logRepository.create({ message: text });
    channel.logs.push(log);

    try {
      await this.logRepository.save(log);
      await this.dmChannelRepository.update(channel.id, { logs: channel.logs });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
