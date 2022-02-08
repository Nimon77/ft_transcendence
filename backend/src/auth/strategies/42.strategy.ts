import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID:
        'ee731a1dee2caf7f5d36718ea46171260de04f643859bf07bb6bb7cf1134ce3a',
      clientSecret:
        '8b21eaf39aa614750b53adfaddc9134c899dfad31587712eb9a9ab8b9b5566c8',
      callbackURL: 'http://127.0.0.1:3000/auth/42/callback',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    return profile;
  }
}
