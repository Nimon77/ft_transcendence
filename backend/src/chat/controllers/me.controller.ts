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
  createChannel(@Request() req, @Body() room: ChatRoom) {
    return this.chatService.createRoom(room, req.user.userId);
  }

  @Get('/me')
  getAllChannels(@Request() req): Promise<any> {
    return this.chatService.getRoomsForUser(req.user.userId);
  }

  @Put('/join')
  joinChannel(@Request() req, @Body() room: ChatRoom) {
    return this.chatService.addUserToRoom(room, req.user.userId);
  }

  @Put('/:id')
  updateChannel(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() room: ChatRoom,
  ) {
    return this.chatService.updateRoom(id, room, req.user.userId);
  }

  @Put(':id/admin')
  changeUserAdmin(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ) {
    return this.chatService.toggleAdminRole(req.user.userId, user.id, id);
  }

  @Put(':id/ban')
  banUserFromRoom(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ) {
    return this.chatService.banUserInRoom(user.id, id, req.user.userId);
  }

  @Post(':id/change/')
  changePass(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() pass: PasswordI,
  ) {
      return this.chatService.changePassword(pass, id, req.user.userId);
  }

  @Put(':id/mute') //mute user from channel
  muteUserFromRoom(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ) {
    return this.chatService.muteUserInRoom(user.id, id, req.user.userId);
  }

  @Get(':id/log') //get current room logs
  getLogsFromRoom(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.chatService.getLogsForRoom(id, req.user.userId);
  }

  @Put(':id/log') //add log to room
  addLogsToRoom(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() message: MessageI,
  ) {
    return this.chatService.addLogForRoom(id, message.message, req.user.userId);
  }

  //for testing

  @Put('/:id/leave')
  leaveChannel(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.chatService.removeUserFromRoom(req.user.userId, id);
  }

  @Put('/:id/kick/:userid') // admin removes user from room
  kickUserFromChannel(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Param('userid', ParseIntPipe) userid: number,
  ) {
    return this.chatService.removeUserFromRoom(userid, id, req.user.userId);
  }
}
