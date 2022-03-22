import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/services/user.service';
import { TextChannel } from '../entities/textChannel.entity';
import { DMChannel } from '../entities/dmChannel.entity';

@Injectable()
export class DMChannelService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @InjectRepository(TextChannel)
    private readonly textChannelRepository: Repository<DMChannel>,
  ) {}
}
