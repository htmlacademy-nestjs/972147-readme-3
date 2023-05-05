import { Module } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPostController } from './blog-post.controller';
import { BlogPostDbRepository } from "./repositories/blog-post.db.repository";
import { NotifyModule } from "../notify/notify.module";

@Module({
  imports: [NotifyModule],
  providers: [BlogPostService, BlogPostDbRepository],
  controllers: [BlogPostController],
})
export class BlogPostModule {}
