import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from '../infrastructure/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

  async login(user: any) {
    const newUser = {
      id: user.id,
      log: user.username,
      ... user
  }
    this.userService.createUser(newUser);
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
