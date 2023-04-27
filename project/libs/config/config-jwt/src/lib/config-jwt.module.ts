import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [jwtConfig],
    }),
  ],
})
export class ConfigJwtModule {}
