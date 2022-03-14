import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { FortyTwoStrategy } from './strategies/42.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    PassportModule,
  ],
  providers: [FortyTwoStrategy, JwtStrategy, AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
