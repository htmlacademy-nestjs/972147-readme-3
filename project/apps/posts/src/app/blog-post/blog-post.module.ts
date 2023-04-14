import { Module } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPostController } from './blog-post.controller';
import { BlogPostMemoryRepository } from "./repositories/blog-post.memory.repository";
import { BlogPostDbRepository } from "./repositories/blog-post.db.repository";

@Module({
  providers: [BlogPostService, BlogPostMemoryRepository, BlogPostDbRepository],
  controllers: [BlogPostController],
})
export class BlogPostModule {}
