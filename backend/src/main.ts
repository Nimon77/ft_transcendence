import { NestFactory } from '@nestjs/core';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get('FRONT_URL'),
    credentials: true,
  });

  const openAPI: OpenAPIObject = JSON.parse(
    readFileSync('swagger.json', 'utf8'),
  );
  SwaggerModule.setup('api', app, openAPI);

  await app.listen(configService.get('PORT', 3000));
}
bootstrap();
