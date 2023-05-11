import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('application.port');
  const globalPrefix = configService.get('application.apiPrefix');
  const specPrefix = configService.get('application.specPrefix');
  const config = new DocumentBuilder().setTitle('The «Users» service').setDescription('Users service API').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);

  app.setGlobalPrefix(globalPrefix);
  SwaggerModule.setup(specPrefix, app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  await app.listen(port);
  Logger.log(`🚀 <<USERS>> app is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`🚀 <<USERS>> documentation on: http://localhost:${port}/${specPrefix}`);
}

bootstrap();
