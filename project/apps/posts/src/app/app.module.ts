import { Module } from '@nestjs/common';
import { BlogPostModule } from './blog-post/blog-post.module';
import { PrismaModule } from './prisma/prisma.module';
import { BlogCommentsModule } from './blog-comments/blog-comments.module';
import { BlogLikesModule } from './blog-likes/blog-likes.module';
import { ConfigAppModule } from "@project/config/config-app";
import { ConfigRabbitmqModule } from "@project/config/config-rabbitmq";
import { NotifyModule } from "./notify/notify.module";

@Module({
  imports: [BlogPostModule, PrismaModule, BlogCommentsModule, BlogLikesModule, ConfigAppModule, ConfigRabbitmqModule, NotifyModule],
})
export class AppModule {}
