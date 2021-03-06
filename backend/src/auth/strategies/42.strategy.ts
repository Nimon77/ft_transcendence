import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';
import { FortyTwoUser } from '../interfaces/42user.interface';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.FORTYTWO_ID,
      clientSecret: process.env.FORTYTWO_SECRET,
      callbackURL: process.env.AUTH_CALLBACK,
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: FortyTwoUser,
  ): FortyTwoUser {
    return profile;
  }
}
