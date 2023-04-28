import { Module } from '@nestjs/common';
import { BlogPostModule } from './blog-post/blog-post.module';
import { PrismaModule } from './prisma/prisma.module';
import { BlogCommentsModule } from './blog-comments/blog-comments.module';
import { BlogLikesModule } from './blog-likes/blog-likes.module';
import { ConfigAppModule } from "@project/config/config-app";
import { ConfigUsersModule } from "@project/config/config-users";
import { BlogAuthModule } from "./blog-auth/blog-auth.module";

@Module({
  imports: [BlogPostModule, PrismaModule, BlogCommentsModule, BlogLikesModule, ConfigAppModule, ConfigUsersModule, BlogAuthModule],
})
export class AppModule {}
