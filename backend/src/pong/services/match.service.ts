import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Match } from '../entity/match.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(User)
    private readonly chatRepo: Repository<User>,
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,
  ) {}

  async getAllMatches(): Promise<Match[]> {
      const matches = await this.matchRepo.find({relations: ['loser', 'winner']});
      return matches;
  }

  async createMatch(user: User, opponent: User)
  {
     const chatroom = await this.matchRepo.create({
        score : "",
        date : new Date(),
        winner : user,
        loser: opponent,
     });
     await this.matchRepo.save(chatroom);
     return chatroom;
  }

  async getMatchesForUser(user: User)
  {
      const Matches = await this.matchRepo.find({where: [{loser: user}, {winner: user}], relations: ['loser', 'winner']});
      return Matches;
  }
}