import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatRoom } from './chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom]), AuthModule],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
