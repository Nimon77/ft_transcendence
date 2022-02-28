import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatRoom } from './chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { MeController } from './me/me.controller';
import { IdController } from './id/id.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom]), AuthModule],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
  controllers: [MeController, IdController],
})
export class ChatModule {}
