import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { ChatRoom } from '../chat.entity';
import { ChatService } from '../chat.service';

@Controller('channel')
export class IdController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/')
  async getAllChannels(): Promise<ChatRoom[]> {
    return await this.chatService.getAllRooms();
  }

  @Post('/')
  async createChannel(@Request() req, @Body() channel: any): Promise<ChatRoom> {
    return await this.chatService.createRoom(channel, req.user);
  }

  @Put('/:id')
  updateChannel(@Param('id', ParseIntPipe) id: number, @Body() channel: any) {
    this.chatService.updateRoom(id, channel);
  }

  @Delete('/:id')
  deleteChannel(@Param('id', ParseIntPipe) id: number) {
    this.chatService.deleteRoom(id);
  }
}
