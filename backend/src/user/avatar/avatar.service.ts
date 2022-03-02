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

  async setAvatar(id: number, filename: string, dataBuffer: Buffer) {
    const avatar = await this.avatarRepo.create({
      id,
      filename,
      data: dataBuffer,
    });
    await this.avatarRepo.save(avatar);
  }

  getAvatarById(id: number): Promise<Avatar> {
    if (id) return this.avatarRepo.findOne(id);
    return null;
  }
}

export default AvatarService;
