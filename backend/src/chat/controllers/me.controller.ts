import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Post,
  Request,
} from '@nestjs/common';
import { ChatRoom } from '../entity/chat.entity';
import { ChatService } from '../chat.service';
import { PasswordI } from '../interfaces/password.interface';
import { MessageI } from '../interfaces/message.interface';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';

@Controller('channel')
export class MeController {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {}

  @Post('/')
  async createChannel(@Request() req, @Body() room: ChatRoom) {
    const user = await this.userService.getUserById(req.user.userId);
    return await this.chatService.createRoom(room, user);
  }

  @Get('/me')
  async getAllChannels(@Request() req): Promise<any> {
    return await this.chatService.getRoomsForUser(req.user.userId);
  }

  @Put('/join')
  async joinChannel(@Request() req, @Body() room: ChatRoom) {
    const user = await this.userService.getUserById(req.user.userId);
    return this.chatService.addUserToRoom(room, user);
  }

  @Put('/:id')
  async updateChannel(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() room: ChatRoom,
  ) {
    const user = await this.userService.getUserById(req.user.userId);
    return this.chatService.updateRoom(id, room, user);
  }

  @Put(':id/admin')
  async changeUserAdmin(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ) {
    const owner = await this.userService.getUserById(req.user.userId);
    const admin = await this.userService.getUserById(user.id);
    return this.chatService.toggleAdminRole(owner, admin, id);
  }

  @Put(':id/ban')
  async banUserFromRoom(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ) {
    const curuser = await this.userService.getUserById(user.id);
    const admin = await this.userService.getUserById(req.user.userId);
    return this.chatService.banUserInRoom(curuser, id, admin);
  }

  @Post(':id/change/')
  async changePass(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() pass: PasswordI,
  ) {
    const user = await this.userService.getUserById(req.user.userId);
    const room = await this.chatService.getRoom(id, []);
    if (room.ownerId == user.id && room.public == false)
      return this.chatService.changePassword(pass, room);
    return 'user unathorized to change password';
  }

  @Put(':id/mute') //mute user from channel
  async muteUserFromRoom(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ) {
    const curuser = await this.userService.getUserById(user.id);
    const admin = await this.userService.getUserById(req.user.userId);
    return this.chatService.muteUserInRoom(curuser, id, admin);
  }

  @Get(':id/log') //get current room logs
  async getLogsFromRoom(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUserById(req.user.userId);
    return this.chatService.getLogsForRoom(id, user);
  }

  @Put(':id/log') //add log to room
  async addLogsToRoom(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() message: MessageI,
  ) {
    const user = await this.userService.getUserById(req.user.userId);
    return this.chatService.addLogForRoom(id, message.message, user);
  }

  //for testing

  @Put('/:id/leave')
  async leaveChannel(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const admin = (
      await this.chatService.getRoom(id, ['users', 'muted', 'banned', 'logs'])
    ).adminId[0];
    const user = await this.userService.getUserById(req.user.userId);
    return this.chatService.removeUserFromRoom(user, id, admin);
  }

  @Put('/:id/kick/:userid') // admin removes user from room
  async kickUserFromChannel(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Param('userid', ParseIntPipe) userid: number,
  ) {
    const admin = await this.userService.getUserById(req.user.userId);
    const user = await this.userService.getUserById(userid);
    return this.chatService.removeUserFromRoom(user, id, admin.id);
  }
}
