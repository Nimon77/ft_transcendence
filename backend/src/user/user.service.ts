import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AvatarService } from './avatar/avatar.service';
import { Avatar } from './avatar/avatar.entity';
import { ChatService } from 'src/chat/chat.service';
import { Status } from './enums/status.enum';
import { User } from './entities/user.entity';
import { Match } from './entities/match.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly avatarService: AvatarService,
    private readonly chatService: ChatService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(id: number): Promise<User> {
    const user: User = await this.userRepository.findOne(id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async createUser(user: User): Promise<User> {
    if (user.id && (await this.userRepository.findOne(user.id)))
      throw new HttpException('User already exist', HttpStatus.CONFLICT);

    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async updateUser(id: number, user: User): Promise<User> {
    await this.getUserById(id);

    const can: Array<string> = ['username', 'friends', 'blocked'];

    for (const key of Object.keys(user))
      if (can.indexOf(key) == -1)
        throw new HttpException(
          'Value cannot be modified',
          HttpStatus.CONFLICT,
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

  async deleteUser(id: number) {
    const user: User = await this.getUserById(id);
    try {
      const rooms = await this.chatService.getRoomsForUser(id);
      rooms.forEach((room) => {
        this.chatService.removeUserFromRoom(user, room.id, room.adminId[0]);
      });
      await this.userRepository.remove({ id, ...new User() });
      if (user.avatarId) await this.avatarService.deleteAvatar(user.avatarId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async setAvatar(user: User, filename: string, buffer: Buffer) {
    let avatar: Avatar;
    if (!user.avatarId)
      avatar = await this.avatarService.createAvatar(user.id, filename, buffer);
    else avatar = await this.avatarService.setAvatar(user.id, filename, buffer);

    if (user.avatarId != avatar.id)
      this.userRepository.update(user.id, { avatarId: avatar.id });
  }

  setStatus(userId: number, status: Status) {
    return this.userRepository.update(userId, { status });
  }

  async updateFollow(user: User, followed_user: User) {
    if (followed_user.id == user.id) return;
    const userFollow = await this.userRepository.find({
      where: { id: In(user.friends) },
    });
    const found = userFollow.find((element) => element.id == followed_user.id);
    if (found) {
      const index = user.friends.indexOf(found.id);
      if (index !== -1) user.friends.splice(index, 1);
    } else user.friends.push(followed_user.id);
    await this.userRepository.update(user.id, {
      friends: user.friends,
    });
  }

  async updateBlock(user: User, blocked_user: User) {
    if (user.id == blocked_user.id) return;
    const userBlock = await this.userRepository.find({
      where: { id: In(user.blocked) },
    });
    const found = userBlock.find((element) => element.id == blocked_user.id);
    if (found) {
      const index = user.blocked.indexOf(found.id);
      if (index !== -1) user.blocked.splice(index, 1);
    } else user.blocked.push(blocked_user.id);
    await this.userRepository.update(user.id, {
      blocked: user.blocked,
    });
  }

  async createMatchHistory(data: any) {
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
}
