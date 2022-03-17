import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from 'src/auth/auth.module';
import { PongGateway } from './pong.gateway';
import { PongService } from './services/pong.service';
import { RoomService } from './services/room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { matchController } from './controller/match.controller';
import { MatchService } from './services/match.service';
import { User } from 'src/user/user.entity';
import { Match } from './entity/match.entity';
import { PongController } from './controller/pong.controller';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule,
  TypeOrmModule.forFeature([User, Match])],
  controllers: [matchController, PongController],
  providers: [PongGateway, RoomService, PongService, MatchService],
})
export class PongModule {}
