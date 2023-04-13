import { Injectable } from "@nestjs/common";
import { BlogPostRepositoryFactory } from "../blog-post.repository.interface";
import { PostTypeEnum } from "@project/shared/app-types";
import { BlogPostMemoryRepository } from "./blog-post.memory.repository";

@Injectable()
export class BlogPostMemoryRepositoryFactory implements BlogPostRepositoryFactory {
  private repositories: Record<PostTypeEnum, BlogPostMemoryRepository<PostTypeEnum>> = {
    [PostTypeEnum.TEXT]: new BlogPostMemoryRepository(PostTypeEnum.TEXT),
    [PostTypeEnum.VIDEO]: new BlogPostMemoryRepository(PostTypeEnum.VIDEO),
    [PostTypeEnum.QUOTE]: new BlogPostMemoryRepository(PostTypeEnum.QUOTE),
    [PostTypeEnum.IMAGE]: new BlogPostMemoryRepository(PostTypeEnum.IMAGE),
    [PostTypeEnum.LINK]: new BlogPostMemoryRepository(PostTypeEnum.LINK),
  };

  public getRepository<T extends PostTypeEnum>(type: T): BlogPostMemoryRepository<T> {
    const repository = this.repositories[type];

    if (!repository) {
      throw new Error('Invalid post type');
    }

    return repository as BlogPostMemoryRepository<T>;
  }
}
