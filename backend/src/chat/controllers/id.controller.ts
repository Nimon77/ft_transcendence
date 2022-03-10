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
import { PasswordI } from '../password.interface';
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

  @Post('/')
  async createChannel(@Request() req, @Body() channel: ChatRoom) {
    const user = await this.userService.getUserById(req.user.userId);
    return await this.chatService.createRoom(channel, user);
  }

  @Put('/:id')
  updateChannel(@Param('id', ParseIntPipe) id: number, @Body() channel: any) {
      return this.chatService.updateRoom(id, channel);
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

  @Put(':id/add')//add any user to any channel
  async addUserToRoom(@Body() user: User, @Param('id', ParseIntPipe) id: number)
  {
    const useradd = await this.userService.getUserById(user.id);
    return this.chatService.addUserToRoom(id, useradd);
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

  @Put(':id/mute')//mute user from channel
  async muteUserFromRoom(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() user: User)
  {
    const curuser = await this.userService.getUserById(user.id);
    const admin = await this.userService.getUserById(req.user.userId);
    return this.chatService.MuteUserInRoom(curuser, id, admin);
  }

  @Put(':id/ban')
  async banUserFromRoom(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() user: User)
  {
    const curuser = await this.userService.getUserById(user.id);
    const admin = await this.userService.getUserById(req.user.userId);
    return this.chatService.BanUserInRoom(curuser, id, admin);
  }

  @Get(':id/log')//get current room logs
  async getLogsFromRoom(@Param('id', ParseIntPipe) id: number, @Request() req)
  {
    const user = await this.userService.getUserById(req.user.userId);
    return this.chatService.getLogsForRoom(id, user);
  }

  @Put(':id/:userid/log')
  async addLogToRoom(@Param('id', ParseIntPipe) id: number, @Body() message: string, @Param('userid', ParseIntPipe) userid: number)
  {
    const user = await this.userService.getUserById(userid);
    return this.chatService.addLogForRoom(id, message, user);
  }

  @Put(':id/log')//add log to room
  async addLogsToRoom(@Param('id', ParseIntPipe) id: number, @Body() message: string, @Request() req)
  {
    const user = await this.userService.getUserById(req.user.userId);
    return this.chatService.addLogForRoom(id, message, user);
  }
}