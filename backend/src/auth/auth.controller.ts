import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'src/user/interfaces/request.interface';
import { UserService } from 'src/user/services/user.service';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { FortyTwoAuthGuard } from './guards/42-auth.guard';
import { FortyTwoUser } from './interfaces/42user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @UseGuards(FortyTwoAuthGuard)
  @Get('42/callback')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async login(@Req() req: any, @Res() response: Response): Promise<void> {
    const token = await this.authService.login(req.user as FortyTwoUser);

    const url = new URL(`${req.protocol}:${req.hostname}`);
    url.port = process.env.FRONT_PORT;
    url.pathname = 'login';
    url.searchParams.set('code', token);

    response.status(302).redirect(url.href);
  }

  @Public()
  @Get('jwt')
  jwt(@Req() req: Request): boolean {
    if (!req.headers.authorization) return false;
    const token = req.headers.authorization.split(' ')[1];
    const payload = this.authService.verifyJWT(token);
    return !!payload;
  }

  @Public()
  @Post('otp')
  loginOTP(
    @Body('token') token: string,
    @Body('code') code: string,
  ): Promise<string> {
    return this.authService.loginOTP(token, code);
  }

  @Get('2fa/qrcode')
  get2FA(@Req() req: Request): Promise<string> {
    return this.authService.generateQR(req.user.userId);
  }

  @Post('2fa')
  create2FA(@Req() req: Request, @Body('code') code: string): Promise<void> {
    return this.authService.saveSecret(req.user.userId, code);
  }

  @Delete('2fa')
  delete2FA(@Req() req: Request): Promise<void> {
    return this.userService.updateOTP(req.user.userId);
  }

  //for testing ----------------------------------------------------
  @Public()
  @Get('generate/:id')
  generateJWT(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.authService.login({ id } as FortyTwoUser);
  }

  @Put('2fa/check')
  check2FA(@Req() req: Request, @Body('code') code: string): any {
    return this.authService.verifyCode(req.user.userId, code);
  }
  //----------------------------------------------------------------
}
