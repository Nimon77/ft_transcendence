import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Match } from '../entities/match.entity';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@Controller('user')
export class IdController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getUser(id);
  }

  @Get('/matches/:id')
  getMatches(@Param('id', ParseIntPipe) userid: number): Promise<Match[]> {
    return this.userService.getMatches(userid);
  }
}
