import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from 'src/auth/auth.module';
import { PongGateway } from './pong.gateway';
import { PongService } from './services/pong.service';
import { RoomService } from './services/room.service';
import { PongController } from './controller/pong.controller';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule],
  controllers: [PongController],
  providers: [PongGateway, RoomService, PongService],
})
export class PongModule {}
