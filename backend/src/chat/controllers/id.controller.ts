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
  getAllChannels(): Promise<ChatRoom[]> {
    return this.chatService.getAllRooms();
  }

  // for testing purposes

  @Get('/:id') //get full room info including baned muted and users
  getRoom(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.getRoom(id, [
      'users',
      'muted',
      'banned',
      'logs',
    ]);
  }

  @Post('/:id') //create channel for specific user
  createChannelForUser(
    @Param('id', ParseIntPipe) userid: number,
    @Body() room: ChatRoom,
  ) {
    return this.chatService.createRoom(room, userid);
  }

  @Delete('/:id')
  deleteChannel(@Param('id', ParseIntPipe) id: number) {
    this.chatService.deleteRoom(id);
  }

  @Put('/:id/add') //add any user to any channel
  addUserToRoom(
    @Param('id', ParseIntPipe) userid: number,
    @Body() room: ChatRoom,
  ) {
    return this.chatService.addUserToRoom(room, userid);
  }

  @Put(':id/check') //check if password is correct
  checkPass(
    @Param('id', ParseIntPipe) id: number,
    @Body() room: ChatRoom,
  ) {
    return this.chatService.checkPassword(id, room.password);
  }

  @Put(':id/:userid/log') //add log to room based on userid
  addLogToRoom(
    @Param('id', ParseIntPipe) id: number,
    @Param('userid', ParseIntPipe) userid: number,
    @Body() message: MessageI,
  ) {
    return this.chatService.addLogForRoom(id, message.message, userid);
  }
}
