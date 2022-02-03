import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/database.module';
import { PhotoModule } from './photo/photo.module';
import { UserModule } from './user/user.module';
import { LoginModule } from './login/login.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      })
    }), DatabaseModule, UserModule, LoginModule, PhotoModule,
  ],
})
export class AppModule {}
