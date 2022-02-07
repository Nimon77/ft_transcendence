import { Module } from '@nestjs/common';
import { AuthService } from './fortytwo/fortytwo.service';
import { LoginController } from './auth.controller';

@Module({
  providers: [AuthService],
  controllers: [LoginController]
})
export class LoginModule {}
