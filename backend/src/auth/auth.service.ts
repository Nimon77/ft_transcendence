import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as https from 'https';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';

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
    await this.userService.getUserById(user.id).catch(async () => {
      await this.userService.createUser({ id: user.id } as User);
      if (user.photos)
        this.userService.setAvatar(
          user.id,
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
