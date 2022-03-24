import { NestFactory } from '@nestjs/core';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get('FRONT_URL'),
    credentials: true,
  });

  const openAPI: OpenAPIObject = JSON.parse(
    readFileSync('./swagger/swagger.json', 'utf8'),
  );
  SwaggerModule.setup('api', app, openAPI, {
    customCss: readFileSync('./swagger/SwaggerDark.css', 'utf-8'),
  });

  await app.listen(configService.get('PORT', 3000));
}
bootstrap().catch(() => null);
