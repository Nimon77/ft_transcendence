import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { MeController } from './controllers/me.controller';
import { IdController } from './controllers/id.controller';
import { MutedUser } from './entity/mute.entity';
import { BannedUser } from './entity/banned.entity';
import { Log } from './entity/log.entity';
import { TextChannel } from './entity/textChannel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TextChannel, MutedUser, BannedUser, Log]),
    AuthModule,
  ],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
  controllers: [MeController, IdController],
})
export class ChatModule {}
