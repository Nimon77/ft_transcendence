import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Post,
  Req,
} from '@nestjs/common';
import { ChatRoom } from '../entity/chat.entity';
import { ChatService } from '../chat.service';
import { PasswordI } from '../interfaces/password.interface';
import { MessageI } from '../interfaces/message.interface';
import { User } from 'src/user/entities/user.entity';
import { Log } from '../entity/log.entity';
import { Request } from 'src/user/interfaces/request.interface';

@Controller('channel')
export class MeController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/')
  createChannel(
    @Req() req: Request,
    @Body() room: ChatRoom,
  ): Promise<ChatRoom> {
    return this.chatService.createRoom(room, req.user.userId);
  }

  @Get('/me')
  getAllChannels(@Req() req: Request): Promise<ChatRoom[]> {
    return this.chatService.getRoomsForUser(req.user.userId);
  }

  @Put('/join')
  joinChannel(@Req() req: Request, @Body() room: ChatRoom): Promise<void> {
    return this.chatService.addUserToRoom(room, req.user.userId);
  }

  @Put('/:id')
  updateChannel(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() room: ChatRoom,
  ): Promise<void> {
    return this.chatService.updateRoom(id, room, req.user.userId);
  }

  @Put(':id/admin')
  changeUserAdmin(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ): Promise<void> {
    return this.chatService.toggleAdminRole(req.user.userId, user.id, id);
  }

  @Put(':id/ban')
  banUserFromRoom(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ): Promise<void> {
    return this.chatService.banUserInRoom(user.id, id, req.user.userId);
  }

  @Post(':id/change/')
  changePass(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() pass: PasswordI,
  ): Promise<void> {
    return this.chatService.changePassword(pass, id, req.user.userId);
  }

  @Put(':id/mute') //mute user from channel
  muteUserFromRoom(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ): Promise<void> {
    return this.chatService.muteUserInRoom(user.id, id, req.user.userId);
  }

  @Get(':id/log') //get current room logs
  getLogsFromRoom(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Log[]> {
    return this.chatService.getLogsForRoom(id, req.user.userId);
  }

  @Put(':id/log') //add log to room
  addLogsToRoom(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() message: MessageI,
  ): Promise<void> {
    return this.chatService.addLogForRoom(id, message.message, req.user.userId);
  }

  //for testing

  @Put('/:id/leave')
  leaveChannel(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.chatService.removeUserFromRoom(req.user.userId, id);
  }

  @Put('/:id/kick/:userid') // admin removes user from room
  kickUserFromChannel(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Param('userid', ParseIntPipe) userid: number,
  ): Promise<void> {
    return this.chatService.removeUserFromRoom(userid, id, req.user.userId);
  }
}
