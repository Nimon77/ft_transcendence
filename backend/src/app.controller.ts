import {
  Controller,
  Get,
  Request,
  UseGuards,
  Res,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { Public } from './auth/decorators/public.decorator';
import { FortyTwoAuthGuard } from './auth/guards/42-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(FortyTwoAuthGuard)
  @Get('auth/42/callback')
  async login(@Request() req, @Res() res) {
    res
      .status(302)
      .redirect(
        'http://127.0.0.1:8080/login?code=' +
          (await this.authService.login(req.user)).access_token,
      );
  }

  @Public()
  @Get('jwt')
  jwt(@Headers() headers) {
    const token = headers.authorization.split(' ')[1];
    return this.authService.verify(token);
  }
}
