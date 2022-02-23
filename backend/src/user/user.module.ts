import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/user.entity';
import { PhotoModule } from 'src/photo/photo.module';
import { ChatModule } from 'src/chat/chat.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User]), PhotoModule, ChatModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
