import { Module } from '@nestjs/common';
import { BlogPostModule } from './blog-post/blog-post.module';
import { PrismaModule } from './prisma/prisma.module';
import { BlogCommentsModule } from './blog-comments/blog-comments.module';
import { BlogLikesModule } from './blog-likes/blog-likes.module';

@Module({
  imports: [BlogPostModule, PrismaModule, BlogCommentsModule, BlogLikesModule],
})
export class AppModule {}
