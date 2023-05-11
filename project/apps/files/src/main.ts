import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('application.port');
  const globalPrefix = configService.get('application.apiPrefix');
  const specPrefix = configService.get('application.specPrefix');
  const docConfig = new DocumentBuilder().setTitle('The «Files» service').setDescription('Files service API').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, docConfig);

  app.setGlobalPrefix(globalPrefix);
  SwaggerModule.setup(specPrefix, app, document);

  await app.listen(port);
  Logger.log(`🚀 <<FILES>> app is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`🚀 <<FILES>> documentation on: http://localhost:${port}/${specPrefix}`);
}

bootstrap();
