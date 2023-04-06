import { Module } from '@nestjs/common';
import { BlogPostModule } from './blog-post/blog-post.module';

@Module({
  imports: [BlogPostModule],
})
export class AppModule {}
