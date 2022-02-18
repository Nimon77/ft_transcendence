import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/database.module';
import { PhotoModule } from './photo/photo.module';
import { UserModule } from './user/user.module';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { PongModule } from './pong/pong.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        FORTYTWO_ID: Joi.string().required(),
        FORTYTWO_SECRET: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        FRONT_URL: Joi.string().required(),
      }),
      ignoreEnvFile: true,
    }),
    DatabaseModule,
    UserModule,
    PhotoModule,
    AuthModule,
    PongModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
