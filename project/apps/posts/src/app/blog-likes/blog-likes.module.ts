import { Module } from '@nestjs/common';
import { BlogLikesService } from './blog-likes.service';
import { BlogLikesController } from './blog-likes.controller';
import { BlogLikesDbRepository } from "./repositories/blog-likes.db.repository";

@Module({
  providers: [BlogLikesService, BlogLikesDbRepository],
  controllers: [BlogLikesController],
})
export class BlogLikesModule {}
