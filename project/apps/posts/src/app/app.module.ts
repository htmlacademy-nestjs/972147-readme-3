import { Module } from '@nestjs/common';
import { BlogPostModule } from './blog-post/blog-post.module';
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [BlogPostModule, PrismaModule],
})
export class AppModule {}
