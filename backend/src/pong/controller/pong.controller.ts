import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RoomService } from '../services/room.service';

@Controller('pong')
export class PongController {
  constructor(private readonly roomservice: RoomService) {}

  @Get('/:id')
  async getRoomForUser(@Param('id', ParseIntPipe) id: number) {
    return await this.roomservice.getRoomForUser(id).code;
  }
}
