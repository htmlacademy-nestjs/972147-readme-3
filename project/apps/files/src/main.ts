import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('The «Files» service')
    .setDescription('Files service API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('spec', app, document);

  const configService = app.get(ConfigService);
  const host = configService.get('application.host');
  const port = configService.get('application.port');

  await app.listen(port);
  Logger.log(`🚀 <<FILES>> app is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`🚀 <<FILES>> documentation on: http://localhost:${port}/spec`);
}

bootstrap();
