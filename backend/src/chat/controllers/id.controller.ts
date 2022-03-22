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
import { ChatService } from '../chat.service';
import { MessageI } from '../interfaces/message.interface';
import { UserService } from 'src/user/services/user.service';
import { TextChannel } from '../entity/textChannel.entity';

@Controller('channel')
export class IdController {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {}

  @Get('/')
  getAllChannels(): Promise<TextChannel[]> {
    return this.chatService.getAllChannels();
  }

  // for testing purposes

  @Get('/:id') //get full channel info including baned muted and users
  getChannel(@Param('id', ParseIntPipe) id: number): Promise<TextChannel> {
    return this.chatService.getChannel(id, [
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
    return this.chatService.createChannel(channel, userid);
  }

  @Delete('/:id')
  deleteChannel(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.chatService.deleteChannel(id);
  }

  @Put('/:id/add') //add any user to any channel
  addUserToChannel(
    @Param('id', ParseIntPipe) userid: number,
    @Body() channel: TextChannel,
  ): Promise<void> {
    return this.chatService.addUserToChannel(channel, userid);
  }

  @Put(':id/check') //check if password is correct
  checkPass(
    @Param('id', ParseIntPipe) id: number,
    @Body() channel: TextChannel,
  ): Promise<boolean> {
    return this.chatService.checkPassword(id, channel.password);
  }

  @Put(':id/:userid/log') //add log to channel based on userid
  addLogToChannel(
    @Param('id', ParseIntPipe) id: number,
    @Param('userid', ParseIntPipe) userid: number,
    @Body() message: MessageI,
  ): Promise<void> {
    return this.chatService.addLogForChannel(id, message.message, userid);
  }
}
