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
  HttpException,
} from '@nestjs/common';
import { ChatRoom } from '../chat.entity';
import { ChatService } from '../chat.service';
import { UserService } from 'src/user/user.service';
import { AddI } from '../interfaces/Add.interface';
import { User } from 'src/user/user.entity';
import { MutedUser } from '../mute.entity';
import { BannedUser } from '../banned.entity';

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

  @Delete('/:id')
  deleteChannel(@Param('id', ParseIntPipe) id: number) {
    this.chatService.deleteRoom(id);
  }

  @Put('/add')//add any user to any channel
  async addUserToRoom(@Body() body: AddI)
  {
    const useradd = await this.userService.getUserById(body.user.id);
    return this.chatService.addUserToRoom(body.room, useradd);
  }

  @Get('/:id')//get full room info including baned muted and users
  async getRoom(@Param('id', ParseIntPipe) id: number)
  {
    return await this.chatService.getRoomInfo(id);
  }

  @Get(':id/check')//check if password is correct
  async checkPass(@Body() room: ChatRoom, @Param('id', ParseIntPipe) id: number)
  {
    return (this.chatService.checkPassword(id, room.password));
  }

  @Post('/:id')//create channel for specific user
  async createChannelForUser(@Param('id', ParseIntPipe) id: number, @Body() channel: any)
  {
    const user = await this.userService.getUserById(id);
    return await this.chatService.createRoom(channel, user);
  }

  @Put(':id/:userid/log')//add log to room based on userid
  async addLogToRoom(@Param('id', ParseIntPipe) id: number, @Body() message: string, @Param('userid', ParseIntPipe) userid: number)
  {
    const user = await this.userService.getUserById(userid);
    return this.chatService.addLogForRoom(id, message, user);
  }
}