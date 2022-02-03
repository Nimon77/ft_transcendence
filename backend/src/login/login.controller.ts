import { Controller, Get, Res } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
    constructor(private loginService : LoginService) {}
    @Get('auth')
    redirectURL(@Res() res) {
        res.status(302).redirect(this.loginService.genURL());
    }
    //@Get('jwt')
}
