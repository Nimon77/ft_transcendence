import { Controller, Get } from '@nestjs/common';
import { TextChannel } from '../entities/textChannel.entity';
import { TextChannelService } from '../services/textChannel.service';

@Controller('channel')
export class IdController {
  constructor(private readonly textChannelService: TextChannelService) {}

  @Get('/')
  getAllChannels(): Promise<TextChannel[]> {
    return this.textChannelService.getAllChannels();
  }
}
