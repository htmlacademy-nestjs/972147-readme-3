import { Post, PostGeneric, PostStatusEnum, PostTypeEnum, PostUnion } from '@project/shared/app-types';
import { randomUUID } from 'node:crypto';
import { PostAuthor, BlogPostRepository, ListBlogPostRepositoryParams } from "./blog-post.repository.interface";
import { BlogPostDtoGeneric } from '../dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogPostMemoryRepository implements BlogPostRepository {
  private repository: Record<string, PostUnion> = {};

  public async get(id: string): Promise<PostUnion | null> {
    if (this.repository[id]) {
      return { ...this.repository[id] };
    }

    return null;
  }

  public async list({ ids, type }: ListBlogPostRepositoryParams): Promise<PostUnion[]> {
    return Object.values(this.repository)
      .filter((post) => {
        if (ids && !ids.includes(post.id)) {
          return false;
        }

        return !(type && post.type !== type);
      })
      .map((post) => ({ ...post }));
  }

  public async create<T extends PostTypeEnum>(dto: BlogPostDtoGeneric<T, PostAuthor>): Promise<PostGeneric<T>> {
    const basePost: Post = {
      id: randomUUID(),
      authorId: dto.authorId,
      publishedAt: dto.publishedAt ? dto.publishedAt : new Date(),
      status: PostStatusEnum.PUBLISHED,
      isRepost: false,
      type: dto.type,
      createdAt: new Date(),
      updatedAt: new Date(),
      likesCount: 0,
      commentsCount: 0,
    };
    const entry = { ...basePost, ...dto } as PostGeneric<T>;
    this.repository[basePost.id] = entry;

    return { ...entry };
  }

  public async delete(id: string): Promise<void> {
    delete this.repository[id];
  }

  public async update<T extends PostTypeEnum>(id: string, dto: BlogPostDtoGeneric<T>): Promise<PostGeneric<T>> {
    this.repository[id] = {
      ...this.repository[id],
      ...dto,
      updatedAt: new Date(),
    };
    return { ...this.repository[id] } as PostGeneric<T>;
  }
}
