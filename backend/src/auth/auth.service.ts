import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(user: any) {
    const newUser = {
      id: user.id,
      log: user.username,
      onlineStatus: true,
      ...user,
    };
    //need to check if user already exist
    try {
      const exist = await this.userService.getUserById(newUser.id);
      exist.onlineStatus = true;
      this.userService.updateUser(exist.id, exist);
    } catch (error) {
      this.userService.createUser(newUser);
    }
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  verify(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch {
      return {};
    }
  }
}
