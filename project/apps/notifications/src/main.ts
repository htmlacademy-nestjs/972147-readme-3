import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const globalPrefix = configService.get('application.apiPrefix');
  const specPrefix = configService.get('application.specPrefix');
  const port = configService.get('application.port');
  const docsConfig = new DocumentBuilder().setTitle('The «Notifications» service').setDescription('Files service API').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, docsConfig);

  app.setGlobalPrefix(globalPrefix);
  SwaggerModule.setup(specPrefix, app, document);

  await app.listen(port);
  Logger.log(`🚀 <<NOTIFICATIONS>> app is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`🚀 <<NOTIFICATIONS>> documentation on: http://localhost:${port}/${specPrefix}`);
}

bootstrap();
