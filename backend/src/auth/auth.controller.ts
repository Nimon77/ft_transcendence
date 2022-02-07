import { Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './fortytwo/fortytwo.service';

@Controller('auth')
export class LoginController {
  constructor(private authService: AuthService) {}

  @Post('fortytwo')
  oauth() : string {
    return (this.authService.genURL());
  }

  @Get('jwt')
  generate() {
	  
  }
}
