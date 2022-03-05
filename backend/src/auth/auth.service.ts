import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import * as https from 'https';

const download = (url: string): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const data = [];
        res
          .on('data', (chunk) => data.push(chunk))
          .on('end', () => resolve(Buffer.concat(data)));
      })
      .on('error', (err) => reject(err));
  });

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(user: any) {
    let newUser: User = {
      id: user.id,
      ...new User(),
    };

    await this.userService.getUserById(newUser.id).catch(async () => {
      newUser = await this.userService.createUser(newUser);
      this.userService.setAvatar(
        newUser,
        '42',
        await download(user.photos[0].value),
      );
    });
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
