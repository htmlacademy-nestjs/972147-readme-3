import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import usersConfig from './users.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [usersConfig],
    }),
  ],
})
export class ConfigUsersModule {}
