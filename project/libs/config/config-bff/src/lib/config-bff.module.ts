import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import bffConfig from './bff.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [bffConfig],
    }),
  ],
})
export class ConfigBffModule {}
