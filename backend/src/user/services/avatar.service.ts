import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Readable } from 'stream';
import { Repository } from 'typeorm';
import { Avatar } from '../entities/avatar.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(Avatar)
    private avatarRepository: Repository<Avatar>,
  ) {}

  async createAvatar(
    filename: string,
    data: Buffer,
    user: User,
  ): Promise<Avatar> {
    const avatar = this.avatarRepository.create({ filename, data, user });

    try {
      await this.avatarRepository.save(avatar);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return avatar;
  }

  async deleteAvatar(avatarId: number): Promise<void> {
    try {
      await this.avatarRepository.delete(avatarId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  toStreamableFile(data: Buffer): StreamableFile {
    return new StreamableFile(Readable.from(data));
  }
}

export default AvatarService;
