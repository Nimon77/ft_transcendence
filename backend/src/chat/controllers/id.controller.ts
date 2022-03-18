import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ChatRoom } from '../entity/chat.entity';
import { ChatService } from '../chat.service';
import { MessageI } from '../interfaces/message.interface';
import { UserService } from 'src/user/services/user.service';

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

  // for testing purposes

  @Get('/:id') //get full room info including baned muted and users
  async getRoom(@Param('id', ParseIntPipe) id: number) {
    return await this.chatService.getRoom(id, [
      'users',
      'muted',
      'banned',
      'logs',
    ]);
  }

  @Post('/:id') //create channel for specific user
  async createChannelForUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() room: ChatRoom,
  ) {
    const user = await this.userService.getUserById(id);
    return await this.chatService.createRoom(room, user);
  }

  @Delete('/:id')
  deleteChannel(@Param('id', ParseIntPipe) id: number) {
    this.chatService.deleteRoom(id);
  }

  @Put('/:id/add') //add any user to any channel
  async addUserToRoom(
    @Param('id', ParseIntPipe) id: number,
    @Body() room: ChatRoom,
  ) {
    const useradd = await this.userService.getUserById(id);
    return this.chatService.addUserToRoom(room, useradd);
  }

  @Put(':id/check') //check if password is correct
  async checkPass(
    @Param('id', ParseIntPipe) id: number,
    @Body() room: ChatRoom,
  ) {
    return this.chatService.checkPassword(id, room.password);
  }

  @Put(':id/:userid/log') //add log to room based on userid
  async addLogToRoom(
    @Param('id', ParseIntPipe) id: number,
    @Param('userid', ParseIntPipe) userid: number,
    @Body() message: MessageI,
  ) {
    const user = await this.userService.getUserById(userid);
    return this.chatService.addLogForRoom(id, message.message, user);
  }
}
