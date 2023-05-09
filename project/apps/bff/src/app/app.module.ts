import { Module } from '@nestjs/common';
import { ConfigBffModule } from '@project/config/config-bff';
import { ConfigAppModule } from '@project/config/config-app';
import { ConfigRabbitmqModule, getRabbitMQOptions } from "@project/config/config-rabbitmq";
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AuthController } from "./auth.controller";
import { UsersController } from "./users.controller";
import { CheckAuthGuard } from "./guards/CheckAuthGuard";
import { CommentsController } from "./comments.controller";
import { FeedController } from "./feed.controller";
import { LikesController } from "./likes.controller";
import { PostsController } from "./posts.controller";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('bff.httpClientTimeoutMs'),
        maxRedirects: configService.get('bff.httpClientMaxRedirects'),
      }),
      inject: [ConfigService],
    }),
    ConfigBffModule,
    ConfigAppModule,
    ConfigRabbitmqModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, getRabbitMQOptions()),
  ],
  controllers: [AuthController, UsersController, CommentsController, FeedController, LikesController, PostsController],
  providers: [CheckAuthGuard]
})
export class AppModule {}
