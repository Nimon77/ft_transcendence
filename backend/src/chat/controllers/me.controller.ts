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
import { ChatService } from '../chat.service';
import { PasswordI } from '../interfaces/password.interface';
import { MessageI } from '../interfaces/message.interface';
import { User } from 'src/user/entities/user.entity';
import { Log } from '../entity/log.entity';
import { Request } from 'src/user/interfaces/request.interface';
import { TextChannel } from '../entity/textChannel.entity';

@Controller('channel')
export class MeController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/')
  createChannel(
    @Req() req: Request,
    @Body() channel: TextChannel,
  ): Promise<TextChannel> {
    return this.chatService.createChannel(channel, req.user.userId);
  }

  @Get('/me')
  getAllChannels(@Req() req: Request): Promise<TextChannel[]> {
    return this.chatService.getChannelsForUser(req.user.userId);
  }

  @Put('/join')
  joinChannel(
    @Req() req: Request,
    @Body() channel: TextChannel,
  ): Promise<void> {
    return this.chatService.addUserToChannel(channel, req.user.userId);
  }

  @Put('/:id')
  updateChannel(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() channel: TextChannel,
  ): Promise<void> {
    return this.chatService.updateChannel(id, channel, req.user.userId);
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
  banUserFromChannel(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ): Promise<void> {
    return this.chatService.banUserInChannel(user.id, id, req.user.userId);
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
  muteUserFromChannel(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ): Promise<void> {
    return this.chatService.muteUserInChannel(user.id, id, req.user.userId);
  }

  @Get(':id/log') //get current channel logs
  getLogsFromChannel(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Log[]> {
    return this.chatService.getLogsForChannel(id, req.user.userId);
  }

  @Put(':id/log') //add log to channel
  addLogsToChannel(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() message: MessageI,
  ): Promise<void> {
    return this.chatService.addLogForChannel(
      id,
      message.message,
      req.user.userId,
    );
  }

  //for testing

  @Put('/:id/leave')
  leaveChannel(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.chatService.removeUserFromChannel(req.user.userId, id);
  }

  @Put('/:id/kick/:userid') // admin removes user from channel
  kickUserFromChannel(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Param('userid', ParseIntPipe) userid: number,
  ): Promise<void> {
    return this.chatService.removeUserFromChannel(userid, id, req.user.userId);
  }
}
