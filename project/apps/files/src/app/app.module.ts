import { Module } from '@nestjs/common';
import { FileModule } from "./file/file.module";
import { ConfigAppModule } from "@project/config/config-app";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigMongoModule, getMongoOptions } from "@project/config/config-mongo";
import { ConfigUsersModule } from "@project/config/config-users";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [FileModule, ConfigMongoModule, ConfigUsersModule, AuthModule, ConfigAppModule, MongooseModule.forRootAsync(getMongoOptions())],
  controllers: [],
  providers: [],
})
export class AppModule {}
