import { Post, PostGeneric, PostStatusEnum, PostTypeEnum } from "@project/shared/app-types";
import { randomUUID } from "node:crypto";
import { BlogPostRepository } from "../blog-post.repository.interface";
import { BlogPostDtoGeneric } from "../../dto";

export class BlogPostMemoryRepository<T extends PostTypeEnum> implements BlogPostRepository<T> {
  constructor(private readonly postType: T) {

  }

  private repository: Record<string, PostGeneric<T>> = {}

  public async get(id: string): Promise<PostGeneric<T> | null> {
    if (this.repository[id]) {
      return {...this.repository[id]};
    }

    return null;
  }

  public async list(ids: string[] = []): Promise<PostGeneric<T>[]> {
    return Object.values(this.repository).filter(post => ids.length === 0 || ids.includes(post.id));
  }

  public async create(dto: BlogPostDtoGeneric<T>): Promise<PostGeneric<T>> {
    const basePost: Post = {
      id: randomUUID(),
      status: PostStatusEnum.PUBLISHED,
      isRepost: false,
      type: this.postType,
      createdAt: new Date(),
      updatedAt: new Date(),
      likesCount: 0,
      commentsCount: 0
    }
    const entry = {...basePost, ...dto} as PostGeneric<T>;
    this.repository[basePost.id] = entry

    return {...entry};
  }

  public async delete(id: string): Promise<void> {
    delete this.repository[id];
  }

  public async update(id: string, dto: BlogPostDtoGeneric<T>): Promise<PostGeneric<T>> {
    this.repository[id] = {...this.repository[id], ...dto, updatedAt: new Date()} as PostGeneric<T>;
    return {...this.repository[id]};
  }
}

