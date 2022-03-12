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
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { ChatRoom } from '../chat.entity';
import { ChatService } from '../chat.service';
import { PasswordI } from '../interfaces/password.interface';
import { MessageI } from '../interfaces/message.interface';


@Controller('channel')
export class MeController {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {}

  @Get('/me')
  async getAllChannels(@Request() req): Promise<any> {
    return await this.chatService.getRoomsForUser(req.user.userId);
  }

  @Put('/join')
  async joinChannel(@Request() req, @Body() room: ChatRoom) {
    const user = await this.userService.getUserById(req.user.userId);
    return this.chatService.addUserToRoom(room, user);
  }

  @Post('/')
  async createChannel(@Request() req, @Body() channel: ChatRoom) {
    const user = await this.userService.getUserById(req.user.userId);
    return await this.chatService.createRoom(channel, user);
  }

  @Put('/')
  async updateChannel(@Body() channel: ChatRoom, @Request() req) {
    const user = await this.userService.getUserById(req.user.userId);
    return this.chatService.updateRoom(channel.id, channel, user);
  }

  @Put(':id/admin')
  async changeUserAdmin(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() admin: User)
  {
    const user = await this.userService.getUserById(req.user.userId);
    const newAdmin = await this.userService.getUserById(admin.id);
    return this.chatService.UserAdminRole(user, newAdmin, id);
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

  @Put(':id/log')//add log to room
  async addLogsToRoom(@Param('id', ParseIntPipe) id: number, @Body() body: MessageI, @Request() req)
  {
    const user = await this.userService.getUserById(req.user.userId);
    return this.chatService.addLogForRoom(id, body.message, user);
  }

  //for testing 

  @Put('/:id/leave')
  async leaveChannel(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const admin = (await this.chatService.getRoomInfo(id)).adminId[0];
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
