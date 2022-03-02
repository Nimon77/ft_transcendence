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
import { UserService } from 'src/user/user.service';

@Controller('channel')
export class IdController {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {}

  @Get('/')
  async getAllChannels(): Promise<ChatRoom[]> {
    return await this.chatService.getAllRooms();
  }

  @Get('/:id')
  async getRoom(@Param('id', ParseIntPipe) id: number)
  {
    return await this.chatService.getRoomInfo(id);
  }

  @Post('/')
  async createChannel(@Request() req, @Body() channel: any): Promise<ChatRoom> {
    const user = await this.userService.getUserById(req.user.userId);
    return await this.chatService.createRoom(channel, user);
  }

  @Post('/:id')
  async createChannelForUser(@Param('id', ParseIntPipe) id: number, @Body() channel: any)
  {
    const user = await this.userService.getUserById(id);
    return await this.chatService.createRoom(channel, user);
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
