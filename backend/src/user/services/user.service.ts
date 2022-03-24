import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvatarService } from './avatar.service';
import { User } from '../entities/user.entity';
import { Match } from '../entities/match.entity';
import { Status } from '../enums/status.enum';
import { Avatar } from '../entities/avatar.entity';
import { NotifyService } from 'src/notify/notify.service';

@Injectable()
export class UserService {
  constructor(
    private readonly avatarService: AvatarService,
    private readonly notifyService: NotifyService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  async getUser(id: number, relations = [] as string[]): Promise<User> {
    let user = null;
    if (id) user = await this.userRepository.findOne(id, { relations });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user;
  }

  async createUser(): Promise<User> {
    const user = this.userRepository.create();
    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async updateUser(id: number, user: User): Promise<User> {
    if (!user) throw new HttpException('Body null', HttpStatus.NOT_FOUND);
    await this.getUser(id);

    const can: Array<string> = ['username', 'followed', 'blocked'];

    for (const key of Object.keys(user))
      if (can.indexOf(key) == -1)
        throw new HttpException(
          'Value cannot be modified',
          HttpStatus.FORBIDDEN,
        );

    try {
      user.id = id;
      if (user.username) user.profileCompleted = true;
      await this.userRepository.update(id, user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    delete user.id;
    return user;
  }

  async setAvatar(userId: number, file: Express.Multer.File): Promise<void> {
    if (!file)
      throw new HttpException('File required', HttpStatus.NOT_ACCEPTABLE);

    const filename = file.originalname;
    const data = file.buffer;

    const user: User = await this.getUser(userId, ['avatar']);

    await this.avatarService.createAvatar(filename, data, user);
    if (user.avatar) await this.avatarService.deleteAvatar(user.avatar.id);
  }

  async getAvatar(userId: number): Promise<Avatar> {
    const user: User = await this.getUser(userId, ['avatar']);
    if (!user.avatar)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user.avatar;
  }

  async setStatus(userId: number, status: Status): Promise<void> {
    const user = await this.getUser(userId);

    if (user.status == status) return;

    try {
      await this.userRepository.update(user.id, { status });
      this.notifyService.emitStatus(user.id, status);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateRank(winner: User, loser: User): Promise<void> {
    try {
      await this.userRepository.update(winner.id, { rank: winner.rank + 1 });
      if (loser.rank > 0)
        await this.userRepository.update(loser.id, { rank: loser.rank - 1 });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createMatchHistory(data: Match): Promise<void> {
    const match: Match = this.matchRepository.create({
      date: new Date(),
      ...data,
    } as Match);

    try {
      await this.matchRepository.save(match);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getMatches(userId: number): Promise<Match[]> {
    const user = await this.getUser(userId, ['won', 'lost']);

    let matches = [];
    if (user.won) matches = matches.concat(user.won);
    if (user.lost) matches = matches.concat(user.lost);

    return matches;
  }

  async toggleFollow(userId: number, targetId: number): Promise<number[]> {
    if (userId == targetId) return;

    const user = await this.getUser(userId);
    const target = await this.getUser(targetId);

    const index = user.followed.findIndex((userId) => userId == target.id);
    if (index == -1) user.followed.push(target.id);
    else user.followed.splice(index, 1);

    try {
      await this.userRepository.update(user.id, {
        followed: user.followed,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return user.followed;
  }

  async toggleBlock(userId: number, targetId: number): Promise<number[]> {
    if (userId == targetId) return;

    const user = await this.getUser(userId);
    const target = await this.getUser(targetId);

    const index = user.blocked.findIndex((userId) => userId == target.id);
    if (index == -1) user.blocked.push(target.id);
    else user.blocked.splice(index, 1);

    try {
      await this.userRepository.update(user.id, {
        blocked: user.blocked,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return user.blocked;
  }
}
