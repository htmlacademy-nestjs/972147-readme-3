import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogPostMemoryRepositoryFactory } from "./repositories/blog-post.memory.repository";
import { Post, PostGeneric, PostStateEnum, PostTypeEnum } from "@project/shared/app-types";
import { BlogPostEntityGeneric, createBlogPostEntity } from "./entities";
import { BlogPostDtoGeneric } from "./dto";

@Injectable()
export class BlogPostService {
  constructor(private readonly factory: BlogPostMemoryRepositoryFactory) {
  }

  public async getPost<T extends PostTypeEnum>(type: T, id: string) {
    const post = await this.factory.getRepository(type).get(id);

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  public async createPost<T extends PostTypeEnum>(type: T, dto: BlogPostDtoGeneric<T>) {
    const basePost: Post = {
      id: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      state: PostStateEnum.PUBLISHED,
      isRepost: false,
      likesCount: 0,
      commentsCount: 0,
      type: type,
    };
    const entity = createBlogPostEntity({...basePost, ...dto} as PostGeneric<T>) as BlogPostEntityGeneric<T>;
    return await this.factory.getRepository(type).create(entity);
  }

  public async deletePost<T extends PostTypeEnum>(type: T, id: string) {
    const post = await this.factory.getRepository(type).get(id);

    if (!post) {
      throw new NotFoundException();
    }

    await this.factory.getRepository(type).delete(id);
  }

  public async updatePost<T extends PostTypeEnum>(type: T, id: string, dto: BlogPostDtoGeneric<T>) {
    const post = await this.factory.getRepository(type).get(id);

    if (!post) {
      throw new NotFoundException();
    }

    const entity = createBlogPostEntity({...post, ...dto, updatedAt: new Date()} as PostGeneric<T>) as BlogPostEntityGeneric<T>;
    return await this.factory.getRepository(type).update(id, entity);
  }
}
