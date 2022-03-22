import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as https from 'https';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { FortyTwoUser } from './interfaces/42user.interface';
import { generateSecret, verify } from '2fa-util';
import { Socket } from 'socket.io';
import { ConnectionService } from 'src/user/services/connection.service';

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
    private readonly connectionService: ConnectionService,
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
    let connection = await this.connectionService
      .getConnection({ '42': data.id }, [])
      .catch(() => null);

    if (!connection) {
      const user = await this.userService.createUser();
      connection = await this.connectionService.createConnection(user.id);
      await this.connectionService.updateConnection(connection.id, {
        '42': data.id,
      });

      if (data.photos) {
        const photo = await download(data.photos[0].value);
        await this.userService.setAvatar(user.id, {
          originalname: '42',
          buffer: photo,
        } as Express.Multer.File);
      }
    }

    return this.generateJWT(connection.id, !connection.otp);
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
    const connection = await this.connectionService.getConnection(
      { user: userId },
      ['user'],
    );
    if (connection.otp)
      throw new HttpException('Already setup', HttpStatus.FORBIDDEN);

    const output = await generateSecret(connection.user.username, 'BananaPong');
    this.secrets.set(connection.user.id, output.secret);
    return output.qrcode;
  }

  async verifyCode(
    userId: number,
    code: string,
    secret?: string,
  ): Promise<void> {
    if (!secret) {
      const connection = await this.connectionService.getConnection(
        { user: userId },
        [],
      );
      secret = connection.otp;
    }

    if (!secret)
      throw new HttpException('No secret found', HttpStatus.NOT_FOUND);

    const check = await verify(code, secret);
    if (!check) throw new HttpException('Invalid code', HttpStatus.FORBIDDEN);
  }

  async saveSecret(userId: number, code: string): Promise<void> {
    const secret = this.secrets.get(Number(userId));
    await this.verifyCode(userId, code, secret);

    this.secrets.delete(userId);
    await this.connectionService.updateOTP(userId, secret);
  }

  async loginOTP(token: string, code: string): Promise<string> {
    const data = this.verifyJWT(token);
    if (!data) throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    if (data.otp)
      throw new HttpException('Already connected', HttpStatus.CONFLICT);

    await this.verifyCode(data.sub, code);
    return this.generateJWT(data.sub, true);
  }
}
