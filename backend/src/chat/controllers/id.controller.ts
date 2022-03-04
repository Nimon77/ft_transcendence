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
import { PasswordI } from '../password.interface';

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

  @Post('/')
  async createChannel(@Request() req, @Body() channel: ChatRoom): Promise<ChatRoom> {
    const user = await this.userService.getUserById(req.user.userId);
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

  @Post(':id/change/')
  async changePass(@Body() pass: PasswordI, @Request() req, @Param('id', ParseIntPipe) id: number)
  {
    const user = await this.userService.getUserById(req.user.userId);
    const room = await this.chatService.getRoomById(id);
    if (room.ownerId == user.id && room.public == false)
      return this.chatService.changePassword(pass, room);
    return ("user unathorized to change password");
  }
  // for testing purposes

  @Get('/:id')
  async getRoom(@Param('id', ParseIntPipe) id: number)
  {
    return await this.chatService.getRoomInfo(id);
  }

  @Get(':id/check')
  async checkPass(@Body() room: ChatRoom, @Param('id', ParseIntPipe) id: number)
  {
    return (this.chatService.checkPassword(id, room.password));
  }

  @Post('/:id')
  async createChannelForUser(@Param('id', ParseIntPipe) id: number, @Body() channel: any)
  {
    const user = await this.userService.getUserById(id);
    return await this.chatService.createRoom(channel, user);
  }
}


