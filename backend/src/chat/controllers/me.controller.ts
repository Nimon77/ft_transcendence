import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Request,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
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
  joinChannel(@Request() req, @Param('id', ParseIntPipe) id: number) {
    this.chatService.addUserToRoom(id, req.user.userId);
  }

  @Put('/:id/leave/:userid')
  async leaveChannel(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Param('userid', ParseIntPipe) userid: number,
  ) {
    const admin = await this.userService.getUserById(req.user.userId);
    const user = await this.userService.getUserById(userid);
    return this.chatService.removeUserFromRoom(user, id, admin.id);
  }
}
