import { Module } from "@nestjs/common";
import { BlogUserModule } from './blog-user/blog-user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigMongoModule, getMongoOptions } from '@project/config/config-mongo';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigAppModule } from '@project/config/config-app';
import { ConfigJwtModule } from '@project/config/config-jwt';
import { ConfigRabbitmqModule } from '@project/config/config-rabbitmq';
import { NotifyModule } from './notify/notify.module';
import { ConfigRedisModule } from '@project/config/config-redis';

@Module({
  imports: [
    BlogUserModule,
    AuthModule,
    ConfigMongoModule,
    ConfigAppModule,
    ConfigJwtModule,
    ConfigRabbitmqModule,
    ConfigRedisModule,
    NotifyModule,
    MongooseModule.forRootAsync(getMongoOptions()),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
