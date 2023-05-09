import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('The «BFF» service')
    .setDescription('Api gateway service API')
    .setVersion('1.0')
    .build();

  const configService = app.get(ConfigService);
  const port = configService.get('application.port');
  const host = configService.get('application.host');

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('spec', app, document);

  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));

  await app.listen(port);
  Logger.log(`🚀 <<BFF>> app is running on: http://${host}:${port}/${globalPrefix}`);
  Logger.log(`🚀 <<BFF>> documentation on: http://${host}:${port}/spec`);
}

bootstrap();
