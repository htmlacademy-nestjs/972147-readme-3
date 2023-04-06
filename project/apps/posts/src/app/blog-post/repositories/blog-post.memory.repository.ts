import { PostTypeEnum, PostGeneric } from "@project/shared/app-types";
import { BlogPostEntityGeneric } from '../entities';
import { randomUUID } from "node:crypto";
import { BlogPostRepository, BlogPostRepositoryFactory } from "./blog-post.repository.interface";
import { Injectable } from "@nestjs/common";

class BlogPostMemoryRepository<T extends PostTypeEnum> implements BlogPostRepository<T> {
  private repository: Record<string, PostGeneric<T>> = {}

  public async get(id: string): Promise<PostGeneric<T> | null> {
    if (this.repository[id]) {
      return {...this.repository[id]};
    }

    return null;
  }

  public async create(entity: BlogPostEntityGeneric<T>): Promise<PostGeneric<T>> {
    const entry = {...entity.toObject(), id: randomUUID()} as PostGeneric<T>;
    this.repository[entry.id] = entry;

    return {...entry};
  }

  public async delete(id: string): Promise<void> {
    delete this.repository[id];
  }

  public async update(id: string, entity: BlogPostEntityGeneric<T>): Promise<PostGeneric<T>> {
    this.repository[id] = {...entity.toObject(), id: id} as PostGeneric<T>;
    return {...this.repository[id]};
  }
}

@Injectable()
export class BlogPostMemoryRepositoryFactory implements BlogPostRepositoryFactory {
  private repositories: Record<PostTypeEnum, BlogPostMemoryRepository<PostTypeEnum>> = {
    [PostTypeEnum.TEXT]: new BlogPostMemoryRepository<PostTypeEnum.TEXT>(),
    [PostTypeEnum.VIDEO]: new BlogPostMemoryRepository<PostTypeEnum.VIDEO>(),
    [PostTypeEnum.QUOTE]: new BlogPostMemoryRepository<PostTypeEnum.QUOTE>(),
    [PostTypeEnum.IMAGE]: new BlogPostMemoryRepository<PostTypeEnum.IMAGE>(),
    [PostTypeEnum.LINK]: new BlogPostMemoryRepository<PostTypeEnum.LINK>(),
  };

  public getRepository<T extends PostTypeEnum>(type: T): BlogPostMemoryRepository<T> {
    const repository = this.repositories[type];

    if (!repository) {
      throw new Error('Invalid post type');
    }

    return repository as BlogPostMemoryRepository<T>;
  }
}
