import { Module } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPostController } from './blog-post.controller';
import { BlogPostDbRepository } from "./repositories/blog-post.db.repository";

@Module({
  providers: [BlogPostService, BlogPostDbRepository],
  controllers: [BlogPostController],
})
export class BlogPostModule {}
