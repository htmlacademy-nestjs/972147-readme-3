import { Injectable, NotFoundException } from '@nestjs/common';
import { PostTypeEnum } from '@project/shared/app-types';
import { BlogPostDtoGeneric } from './dto';
import { BlogPostDbRepository } from './repositories/blog-post.db.repository';
import { BlogPostQuery } from "./query/blog-post.query";

@Injectable()
export class BlogPostService {
  constructor(private readonly repository: BlogPostDbRepository) {}

  public async getPost(id: string) {
    const post = await this.repository.get(id);

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  public async createPost<T extends PostTypeEnum>(dto: BlogPostDtoGeneric<T>) {
    return await this.repository.create({ ...dto, tags: dto.tags?.map((t) => t.toLowerCase()), authorId: 'some author id' }); // TODO: get author id from context
  }

  public async deletePost(id: string) {
    const post = await this.repository.get(id);

    if (!post) {
      throw new NotFoundException();
    }

    await this.repository.delete(id);
  }

  public async updatePost<T extends PostTypeEnum>(id: string, dto: BlogPostDtoGeneric<T>) {
    const post = await this.repository.get(id);

    if (!post) {
      throw new NotFoundException();
    }

    return await this.repository.update(id, { ...dto, tags: dto.tags?.map((t) => t.toLowerCase()) });
  }

  public async listPosts(query: BlogPostQuery) {
    return await this.repository.list(query);
  }
}
