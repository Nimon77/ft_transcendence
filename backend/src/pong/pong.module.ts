import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PongGateway } from './pong.gateway';
import { PongService } from './services/pong.service';
import { RoomService } from './services/room.service';

@Module({
  imports: [AuthModule],
  providers: [PongGateway, RoomService, PongService],
})
export class PongModule {}
