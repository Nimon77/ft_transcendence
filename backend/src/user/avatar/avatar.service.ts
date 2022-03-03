import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avatar } from './avatar.entity';

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(Avatar)
    private avatarRepo: Repository<Avatar>,
  ) {}

  async setAvatar(
    id: number,
    name: string,
    dataBuffer: Buffer,
  ): Promise<Avatar> {
    const currentavatar = await this.avatarRepo.findOne(id);
    currentavatar.data = dataBuffer;
    currentavatar.filename = name;
    this.avatarRepo.save(currentavatar);
    return currentavatar;
  }

  async createAvatar(
    id: number,
    name: string,
    dataBuffer: Buffer,
  ): Promise<Avatar> {
    const currentavatar = this.avatarRepo.create({
      id,
      filename: name,
      data: dataBuffer,
    });
    await this.avatarRepo.save(currentavatar);
    return currentavatar;
  }

  getAvatarById(id: number): Promise<Avatar> {
    if (id) return this.avatarRepo.findOne(id);
    return null;
  }
}

export default AvatarService;
