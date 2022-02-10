import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../infrastructure/user.entity';
import { PhotoService } from 'src/photo/photo.service';
import { PhotoModule } from 'src/photo/photo.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PhotoModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
