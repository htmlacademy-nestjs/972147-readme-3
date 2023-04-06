import { Module } from '@nestjs/common';
import { BlogUserController } from './blog-user.controller';
import { BlogUserMemoryRepository } from "./repository/blog-user.memory-repository";
import { BlogUserService } from "./blog-user.service";

@Module({
  providers: [BlogUserMemoryRepository, BlogUserService],
  controllers: [BlogUserController],
  exports: [BlogUserMemoryRepository],
})
export class BlogUserModule {}
