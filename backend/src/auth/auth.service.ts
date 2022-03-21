import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as https from 'https';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { FortyTwoUser } from './interfaces/42user.interface';
import { generateSecret, verify } from '2fa-util';
import { Socket } from 'socket.io';

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

  generateJWT(userId: number, otp = true): string {
    return this.jwtService.sign({ sub: userId, otp });
  }

  verifyJWT(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch {
      return null;
    }
  }

  async login(data: FortyTwoUser): Promise<string> {
    let user = await this.userService.getUser(data.id, []);

    if (!user) {
      user = await this.userService.createUser({ id: data.id } as User);

      const photo = await download(data.photos[0].value);
      await this.userService.setAvatar(user.id, {
        originalname: '42',
        buffer: photo,
      } as Express.Multer.File);
    }

    return this.generateJWT(user.id, !user.otp);
  }

  async getUserFromSocket(client: Socket): Promise<User> {
    const authorization = client.handshake.headers.authorization;
    const token = authorization && authorization.split(' ')[1];
    if (!token) return null;

    const payload = this.verifyJWT(token);
    if (!payload) return null;

    const user = await this.userService
      .getUser(payload.sub, [])
      .catch(() => null);
    if (!user) return null;
    return user;
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

  async loginOTP(token: string, code: string): Promise<string> {
    const data = this.verifyJWT(token);
    if (!data)
      throw new HttpException('Invalid token', HttpStatus.NOT_ACCEPTABLE);
    if (data.otp)
      throw new HttpException('Already connected', HttpStatus.CONFLICT);

    await this.verifyCode(data.sub, code);
    return this.generateJWT(data.sub, true);
  }
}
