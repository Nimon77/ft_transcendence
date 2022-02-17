import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

  async login(user: any) {
    const newUser = {
      id: user.id,
      log: user.username,
      onlineStatus: true,
      ... user
  }
    //need to check if user already exist
    const exist = await this.userService.getUserById(newUser.id);
    if (exist)
    {
      exist.onlineStatus = true;
      this.userService.updateUser(exist.id, exist);
    }
    else
      this.userService.createUser(newUser);
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
