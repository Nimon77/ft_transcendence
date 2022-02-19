import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatRoom } from './chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';


@Module({
  imports: [UserModule, TypeOrmModule.forFeature([ChatRoom])],
  providers: [ChatGateway, ChatService]
})
export class ChatModule {}
