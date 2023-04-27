import { Module } from '@nestjs/common';
import { FileModule } from "./file/file.module";
import { ConfigAppModule } from "@project/config/config-app";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigMongoModule, getMongoOptions } from "@project/config/config-mongo";

@Module({
  imports: [FileModule, ConfigMongoModule, ConfigAppModule, MongooseModule.forRootAsync(getMongoOptions())],
  controllers: [],
  providers: [],
})
export class AppModule {}
