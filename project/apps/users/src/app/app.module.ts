import { Module } from '@nestjs/common';
import { BlogUserModule } from './blog-user/blog-user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigUsersModule, getMongoOptions } from '@project/config/config-users';
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    BlogUserModule,
    AuthModule,
    ConfigUsersModule,
    MongooseModule.forRootAsync(getMongoOptions())
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
