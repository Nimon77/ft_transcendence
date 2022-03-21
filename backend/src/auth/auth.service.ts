import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as https from 'https';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { FortyTwoUser } from './interfaces/42user.interface';
import { generateSecret, verify } from '2fa-util';

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
  private secrets: Map<number, string> = new Map();

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(user: FortyTwoUser): Promise<any> {
    await this.userService.getUser(user.id, []).catch(async () => {
      await this.userService.createUser({ id: user.id } as User);
      if (user.photos)
        await this.userService.setAvatar(user.id, {
          originalname: '42',
          buffer: await download(user.photos[0].value),
        } as Express.Multer.File);
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

  async generateQR(userId: number): Promise<string> {
    const user = await this.userService.getUser(userId, []);
    if (user.otp)
      throw new HttpException('Already setup', HttpStatus.FORBIDDEN);

    const output = await generateSecret(user.username, 'BananaPong');
    this.secrets.set(user.id, output.secret);
    return output.qrcode;
  }

  async verifyCode(
    userId: number,
    code: string,
    secret?: string,
  ): Promise<void> {
    const user = await this.userService.getUser(userId, []);
    if (!secret) secret = user.otp;

    if (!secret)
      throw new HttpException('No secret found', HttpStatus.NOT_FOUND);

    const check = await verify(code, secret);
    if (!check) throw new HttpException('Invalid code', HttpStatus.FORBIDDEN);
  }

  async saveSecret(userId: number, code: string): Promise<void> {
    const secret = this.secrets.get(Number(userId));
    await this.verifyCode(userId, code, secret);

    this.secrets.delete(userId);
    await this.userService.updateOTP(userId, secret);
  }
}
