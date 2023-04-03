import { Module } from '@nestjs/common';
import { BlogUserController } from './blog-user.controller';

@Module({
  controllers: [BlogUserController],
})
export class BlogUserModule {}
