import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogPostDbRepositoryFactory } from "./repositories/db";
import { PostTypeEnum } from "@project/shared/app-types";
import { BlogPostDtoGeneric } from "./dto";

@Injectable()
export class BlogPostService {
  constructor(private readonly factory: BlogPostDbRepositoryFactory) {
  }

  public async getPost<T extends PostTypeEnum>(type: T, id: string) {
    const post = await this.factory.getRepository(type).get(id);

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  public async createPost<T extends PostTypeEnum>(type: T, dto: BlogPostDtoGeneric<T>) {
    return await this.factory.getRepository(type).create(dto);
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

    return await this.factory.getRepository(type).update(id, dto);
  }
}
