import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { Match } from '../entities/match.entity';
import { User } from '../entities/user.entity';
import { AvatarService } from '../services/avatar.service';
import { UserService } from '../services/user.service';

@Controller('user')
export class IdController {
  constructor(
    private readonly userService: UserService,
    private readonly avatarService: AvatarService,
  ) {}

  @Get('/')
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get('/:id')
  getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getUser(id);
  }

  @Get('/:id/avatar')
  async getAvatar(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    const avatar = await this.userService.getAvatar(id);
    response.set({
      'Content-Disposition': `inline; filename="${avatar.filename}"`,
      'Content-Type': 'image/*',
    });
    return this.avatarService.toStreamableFile(avatar.data);
  }

  @Get('/matches/:id')
  getMatches(@Param('id', ParseIntPipe) userid: number): Promise<Match[]> {
    return this.userService.getMatches(userid);
  }
}
