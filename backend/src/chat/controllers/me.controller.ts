import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { PasswordI } from '../interfaces/password.interface';
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

  @Post(':id/change/')
  changePass(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() pass: PasswordI,
  ): Promise<void> {
    return this.textChannelService.changePassword(pass, id, req.user.userId);
  }
}
