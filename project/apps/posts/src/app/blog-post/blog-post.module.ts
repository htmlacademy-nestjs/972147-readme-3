import { Module } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPostMemoryRepositoryFactory } from './repositories/memory';
import { BlogPostController } from './blog-post.controller';

@Module({
  providers: [BlogPostService, BlogPostMemoryRepositoryFactory],
  controllers: [BlogPostController],
})
export class BlogPostModule {}
