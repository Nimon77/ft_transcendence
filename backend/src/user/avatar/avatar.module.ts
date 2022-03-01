import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarService } from 'src/user/avatar/avatar.service';
import { Avatar } from './avatar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Avatar])],
  providers: [AvatarService],
  exports: [AvatarService],
})
export class AvatarModule {}
