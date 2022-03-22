import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { MessageI } from '../interfaces/message.interface';
import { UserService } from 'src/user/services/user.service';
import { TextChannel } from '../entities/textChannel.entity';
import { TextChannelService } from '../services/textChannel.service';

@Controller('channel')
export class IdController {
  constructor(
    private readonly textChannelService: TextChannelService,
    private readonly userService: UserService,
  ) {}

  @Get('/')
  getAllChannels(): Promise<TextChannel[]> {
    return this.textChannelService.getAllChannels();
  }

  // for testing purposes

  @Get('/:id') //get full channel info including baned muted and users
  getChannel(@Param('id', ParseIntPipe) id: number): Promise<TextChannel> {
    return this.textChannelService.getChannel(id, [
      'users',
      'muted',
      'banned',
      'logs',
    ]);
  }

  @Post('/:id') //create channel for specific user
  createChannelForUser(
    @Param('id', ParseIntPipe) userid: number,
    @Body() channel: TextChannel,
  ): Promise<TextChannel> {
    return this.textChannelService.createChannel(channel, userid);
  }

  @Delete('/:id')
  deleteChannel(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.textChannelService.deleteChannel(id);
  }

  @Put('/:id/add') //add any user to any channel
  addUserToChannel(
    @Param('id', ParseIntPipe) userid: number,
    @Body() channel: TextChannel,
  ): Promise<void> {
    return this.textChannelService.addUserToChannel(channel, userid);
  }

  @Put(':id/check') //check if password is correct
  checkPass(
    @Param('id', ParseIntPipe) id: number,
    @Body() channel: TextChannel,
  ): Promise<boolean> {
    return this.textChannelService.checkPassword(id, channel.password);
  }

  @Put(':id/:userid/log') //add log to channel based on userid
  addLogToChannel(
    @Param('id', ParseIntPipe) id: number,
    @Param('userid', ParseIntPipe) userid: number,
    @Body() message: MessageI,
  ): Promise<void> {
    return this.textChannelService.addLogForChannel(
      id,
      message.message,
      userid,
    );
  }
}
