import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatRoom } from './chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { MeController } from './controllers/me.controller';
import { IdController } from './controllers/id.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom]), AuthModule],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
  controllers: [MeController, IdController],
})
export class ChatModule {}
