import { Module } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPostMemoryRepositoryFactory } from './repositories/memory';
import { BlogPostDbRepositoryFactory } from './repositories/db';
import { BlogPostController } from './blog-post.controller';

@Module({
  providers: [BlogPostService, BlogPostMemoryRepositoryFactory, BlogPostDbRepositoryFactory],
  controllers: [BlogPostController],
})
export class BlogPostModule {}
