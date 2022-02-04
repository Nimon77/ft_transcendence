import { Controller, Get, Res } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

@Controller('login')
export class LoginController {
  constructor(private authService: AuthService) {}

  @Get('auth')
  oauth(@Res() res) {
    res.status(302).redirect(this.authService.genURL());
  }

  @Get('jwt')
  generate() {
	  
  }
}
