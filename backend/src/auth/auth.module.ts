import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { FortyTwoStrategy } from './strategies/42.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    PassportModule, UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, FortyTwoStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
