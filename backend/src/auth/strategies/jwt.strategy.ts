import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  validate(payload: any): any {
    if (!payload.otp)
      throw new HttpException('Need OTP validation', HttpStatus.FORBIDDEN);
    return { userId: payload.sub };
  }
}
