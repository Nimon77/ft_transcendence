import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LoginController } from './login.controller';

@Module({
  providers: [AuthService],
  controllers: [LoginController]
})
export class LoginModule {}
