import { Module } from '@nestjs/common';
import { BlogCommentsService } from './blog-comments.service';
import { BlogCommentController } from './blog-comment.controller';
import { BlogCommentDbRepository } from "./repositories/blog-comment.db.repository";

@Module({
  providers: [BlogCommentsService, BlogCommentDbRepository],
  controllers: [BlogCommentController],
})
export class BlogCommentsModule {}
