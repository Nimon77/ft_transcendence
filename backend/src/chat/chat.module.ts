import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { MeController } from './controllers/me.controller';
import { IdController } from './controllers/id.controller';
import { MutedUser } from './entities/mute.entity';
import { BannedUser } from './entities/banned.entity';
import { Log } from './entities/log.entity';
import { TextChannel } from './entities/textChannel.entity';
import { TextChannelService } from './services/textChannel.service';
import { DMChannelService } from './services/dmChannel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TextChannel, MutedUser, BannedUser, Log]),
    AuthModule,
  ],
  providers: [ChatGateway, TextChannelService, DMChannelService],
  controllers: [MeController, IdController],
})
export class ChatModule {}
