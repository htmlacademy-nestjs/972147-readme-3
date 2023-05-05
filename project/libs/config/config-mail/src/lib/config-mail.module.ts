import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import mailConfig from './mail.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [mailConfig],
    }),
  ],
})
export class ConfigMailModule {}
