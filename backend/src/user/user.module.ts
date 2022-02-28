import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/user.entity';
import { PhotoModule } from 'src/photo/photo.module';
import { ChatModule } from 'src/chat/chat.module';
import { MeController } from './me/me.controller';
import { IdController } from './id/id.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User]), PhotoModule, ChatModule],
  controllers: [MeController, IdController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
