import {
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { FortyTwoAuthGuard } from './guards/42-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(FortyTwoAuthGuard)
  @Get('42/callback')
  async login(@Req() request: any, @Res() response: Response) {
    const data = await this.authService.login(request.user);

    const url = new URL(`${request.protocol}:${request.hostname}`);
    url.port = process.env.FRONT_PORT;
    url.pathname = 'login';
    url.searchParams.set('code', data.access_token);

    response.status(302).redirect(url.href);
  }

  @Public()
  @Get('jwt')
  jwt(@Headers() headers) {
    if (!headers.authorization) return false;
    const token = headers.authorization.split(' ')[1];
    return !!this.authService.verify(token).sub;
  }

  @Public()
  @Get('generate/:id')
  generateJWT(@Param('id', ParseIntPipe) id: number) {
    return this.authService.login({ id });
  }
}
