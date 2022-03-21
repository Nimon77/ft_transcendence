import {
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
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { FortyTwoAuthGuard } from './guards/42-auth.guard';
import { FortyTwoUser } from './interfaces/42user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(FortyTwoAuthGuard)
  @Get('42/callback')
  async login(@Req() req: Request, @Res() response: Response): Promise<void> {
    const data = await this.authService.login(req.user as FortyTwoUser);

    const url = new URL(`${req.protocol}:${req.hostname}`);
    url.port = process.env.FRONT_PORT;
    url.pathname = 'login';
    url.searchParams.set('code', data.access_token);

    response.status(302).redirect(url.href);
  }

  @Public()
  @Get('jwt')
  jwt(@Req() req: Request): boolean {
    if (!req.headers.authorization) return false;
    const token = req.headers.authorization.split(' ')[1];
    return !!this.authService.verify(token).sub;
  }

  @Public()
  @Get('generate/:id')
  generateJWT(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.authService.login({ id } as FortyTwoUser);
  }

  @Get('2fa')
  get2FA(@Req() req: Request): any {
    return req;
  }

  @Post('2fa')
  Create2FA(@Req() req: Request): any {
    return req;
  }

  @Delete('2fa')
  Delete2FA(@Req() req: Request): any {
    return req;
  }

  @Put('2fa/check')
  Check2FA(@Req() req: Request): any {
    return req;
  }
}
