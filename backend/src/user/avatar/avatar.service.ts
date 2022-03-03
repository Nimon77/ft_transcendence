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

  async setAvatar(id: number, name: string, dataBuffer: Buffer) {
    console.log(id);
    const currentavatar = await this.avatarRepo.findOne(id);
    currentavatar.data = dataBuffer;
    currentavatar.filename = name;
    console.log(currentavatar);
    await this.avatarRepo.save(currentavatar);
  }

  async createAvatar(id: number, name: string, dataBuffer: Buffer)
  {
    const avatar = await this.avatarRepo.create({
      id,
      filename: name,
      data: dataBuffer,
    });
  }

  getAvatarById(id: number): Promise<Avatar> {
    if (id) return this.avatarRepo.findOne(id);
    return null;
  }
}

export default AvatarService;
