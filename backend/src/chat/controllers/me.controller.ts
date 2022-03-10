import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Request,
} from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { ChatRoom } from '../chat.entity';
import { ChatService } from '../chat.service';

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

  @Put('/:id/join')
  async joinChannel(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() room: ChatRoom) {
    const user = await this.userService.getUserById(req.user.userId);
    this.chatService.addUserToRoom(room, user);
  }

  @Put(':id/admin')
  async changeUserAdmin(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() admin: User)
  {
    const user = await this.userService.getUserById(req.user.userId);
    const newAdmin = await this.userService.getUserById(admin.id);
    return this.chatService.UserAdminRole(user, newAdmin, id);
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
