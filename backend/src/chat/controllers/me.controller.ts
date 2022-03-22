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
import { PasswordI } from '../interfaces/password.interface';
import { MessageI } from '../interfaces/message.interface';
import { User } from 'src/user/entities/user.entity';
import { Log } from '../entities/log.entity';
import { Request } from 'src/user/interfaces/request.interface';
import { TextChannel } from '../entities/textChannel.entity';
import { TextChannelService } from '../services/textChannel.service';

@Controller('channel')
export class MeController {
  constructor(private readonly textChannelService: TextChannelService) {}

  @Post('/')
  createChannel(
    @Req() req: Request,
    @Body() channel: TextChannel,
  ): Promise<TextChannel> {
    return this.textChannelService.createChannel(channel, req.user.userId);
  }

  @Get('/me')
  getAllChannels(@Req() req: Request): Promise<TextChannel[]> {
    return this.textChannelService.getChannelsForUser(req.user.userId);
  }

  @Put('/join')
  joinChannel(
    @Req() req: Request,
    @Body() channel: TextChannel,
  ): Promise<void> {
    return this.textChannelService.addUserToChannel(channel, req.user.userId);
  }

  @Put('/:id')
  updateChannel(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() channel: TextChannel,
  ): Promise<void> {
    return this.textChannelService.updateChannel(id, channel, req.user.userId);
  }

  @Put(':id/admin')
  changeUserAdmin(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ): Promise<void> {
    return this.textChannelService.toggleAdminRole(
      req.user.userId,
      user.id,
      id,
    );
  }

  @Put(':id/ban')
  banUserFromChannel(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ): Promise<void> {
    return this.textChannelService.banUserInChannel(
      user.id,
      id,
      req.user.userId,
    );
  }

  @Post(':id/change/')
  changePass(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() pass: PasswordI,
  ): Promise<void> {
    return this.textChannelService.changePassword(pass, id, req.user.userId);
  }

  @Put(':id/mute') //mute user from channel
  muteUserFromChannel(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ): Promise<void> {
    return this.textChannelService.muteUserInChannel(
      user.id,
      id,
      req.user.userId,
    );
  }

  @Get(':id/log') //get current channel logs
  getLogsFromChannel(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Log[]> {
    return this.textChannelService.getLogsForChannel(id, req.user.userId);
  }

  @Put(':id/log') //add log to channel
  addLogsToChannel(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() message: MessageI,
  ): Promise<void> {
    return this.textChannelService.addLogForChannel(
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
    return this.textChannelService.removeUserFromChannel(req.user.userId, id);
  }

  @Put('/:id/kick/:userid') // admin removes user from channel
  kickUserFromChannel(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Param('userid', ParseIntPipe) userid: number,
  ): Promise<void> {
    return this.textChannelService.removeUserFromChannel(
      userid,
      id,
      req.user.userId,
    );
  }
}
