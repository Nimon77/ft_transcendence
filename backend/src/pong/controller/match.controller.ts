import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Request,
    Post,
    Put,
  } from '@nestjs/common';
import { Match } from '../entity/match.entity';
import { UserService } from 'src/user/user.service';
import { MatchService } from '../services/match.service';
import { User } from 'src/user/user.entity';
import { MatchI } from '../interfaces/match.interface';
import { match } from 'assert';
  @Controller('match')
export class matchController {
  constructor(
    private readonly matchService: MatchService,
    private readonly userService: UserService,
  ) {}

  @Get('/')
  async getAllMatches(): Promise<Match[]> {
    return await this.matchService.getAllMatches();
  }

  @Get('/me')
  async getMyMatches(@Request() req) {
    const user = await this.userService.getUserById(req.user.userId);
    return await this.matchService.getMatchesForUser(user);
  }

  @Post()
  async createMatch(@Request() req, @Body() match: MatchI) {
      const user = await this.userService.getUserById(req.user.userId);
      const other = await this.userService.getUserById(match.user.id)
      return await this.matchService.createMatch(user, other, match.score);
  }
}