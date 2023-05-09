import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('The «Notifications» service')
    .setDescription('Files service API')
    .setVersion('1.0')
    .build();

  const configService = app.get(ConfigService);
  const host = configService.get('application.host');
  const port = configService.get('application.port');

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('spec', app, document);

  await app.listen(port);
  Logger.log(`🚀 <<NOTIFICATIONS>> app is running on: http://${host}:${port}/${globalPrefix}`);
  Logger.log(`🚀 <<NOTIFICATIONS>> documentation on: http://${host}:${port}/spec`);
}

bootstrap();
