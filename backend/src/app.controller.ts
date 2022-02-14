import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { FortyTwoAuthGuard } from './auth/guards/42-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(FortyTwoAuthGuard)
  @Get('auth/42/callback')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
