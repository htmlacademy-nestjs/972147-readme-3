import { PrismaService } from '../../../prisma/prisma.service';
import { PostTypeEnum } from "@project/shared/app-types";
import { BlogPostRepository, BlogPostRepositoryFactory } from "../blog-post.repository.interface";
import { Injectable } from "@nestjs/common";
import { BlogPostDbImageRepository } from "./blog-post.db.image.repository";
import { BlogPostDbTextRepository } from "./blog-post.db.text.repository";
import { BlogPostDbVideoRepository } from "./blog-post.db.video.repository";
import { BlogPostDbQuoteRepository } from "./blog-post.db.quote.repository";
import { BlogPostDbLinkRepository } from "./blog-post.db.link.repository";


@Injectable()
export class BlogPostDbRepositoryFactory implements BlogPostRepositoryFactory {
  constructor(private readonly prisma: PrismaService) {
  }


  private repositories: Record<PostTypeEnum, BlogPostRepository<PostTypeEnum>> = {
    [PostTypeEnum.IMAGE]: new BlogPostDbImageRepository(this.prisma),
    [PostTypeEnum.TEXT]: new BlogPostDbTextRepository(this.prisma),
    [PostTypeEnum.VIDEO]: new BlogPostDbVideoRepository(this.prisma),
    [PostTypeEnum.QUOTE]: new BlogPostDbQuoteRepository(this.prisma),
    [PostTypeEnum.LINK]: new BlogPostDbLinkRepository(this.prisma),
  };

  public getRepository<T extends PostTypeEnum>(type: T): BlogPostRepository<T> {
    const repository = this.repositories[type];

    if (!repository) {
      throw new Error('Invalid post type');
    }

    return repository as BlogPostRepository<T>;
  }
}
