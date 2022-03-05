import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './user.entity';
import { AvatarService } from './avatar/avatar.service';
import { Avatar } from './avatar/avatar.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly avatarService: AvatarService,
  ) {}

  getAllUsers(): Promise<User[]> {
    return this.repo.find();
  }

  async getUserById(id: number): Promise<User> {
    const user: User = await this.repo.findOne(id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async createUser(user: User): Promise<User> {
    const newUser = {
      id: user.id,
    };
    newUser.id = user.id;
    await this.repo.save(newUser); //will throw exception if username is already taken
    return user;
  }

  async updateUser(id: number, user: User): Promise<User> {
    const oldUser: User = await this.getUserById(id);
    if (user.id && user.id != oldUser.id)
      throw new HttpException('Cannot update user id', HttpStatus.BAD_REQUEST);
    user.id = oldUser.id;

    try {
      await this.repo.update(oldUser.id, user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    delete user.id;
    return user;
  }

  async deleteUser(id: number) {
    const firstUser = await this.repo.findOne(id);
    if (firstUser) {
      await this.repo.remove(firstUser);
    } else throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async setAvatar(user: User, filename: string, buffer: Buffer) {
    let avatar: Avatar;
    if (!user.avatarId)
      avatar = await this.avatarService.createAvatar(user.id, filename, buffer);
    else avatar = await this.avatarService.setAvatar(user.id, filename, buffer);

    if (user.avatarId != avatar.id)
      this.repo.update(user.id, { avatarId: avatar.id });
  }

  async updateFollow(user: User, followed_user: User) {
    if (followed_user.id == user.id) return;
    const userFollow = await this.repo.find({
      where: { id: In(user.friends) },
    });
    const found = userFollow.find((element) => element.id == followed_user.id);
    if (found) {
      var index = user.friends.indexOf(found.id);
      if (index !== -1) user.friends.splice(index, 1);
    } else user.friends.push(followed_user.id);
    await this.repo.update(user.id, {
      friends: user.friends,
    });
  }

  async updateBlock(user: User, blocked_user: User) {
    if (user.id == blocked_user.id) return;
    const userBlock = await this.repo.find({ where: { id: In(user.blocked) } });
    const found = userBlock.find((element) => element.id == blocked_user.id);
    if (found) {
      var index = user.blocked.indexOf(found.id);
      if (index !== -1) user.blocked.splice(index, 1);
    } else user.blocked.push(blocked_user.id);
    await this.repo.update(user.id, {
      blocked: user.blocked,
    });
  }
}
