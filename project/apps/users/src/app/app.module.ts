import { Module } from '@nestjs/common';
import { BlogUserModule } from './blog-user/blog-user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigMongoModule, getMongoOptions } from '@project/config/config-mongo';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigAppModule } from "@project/config/config-app";

@Module({
  imports: [BlogUserModule, AuthModule, ConfigMongoModule, ConfigAppModule, MongooseModule.forRootAsync(getMongoOptions())],
  controllers: [],
  providers: [],
})
export class AppModule {}
