import { Injectable, NotFoundException } from '@nestjs/common';
import { PostTypeEnum } from '@project/shared/app-types';
import { BlogPostDtoGeneric } from './dto';
import { BlogPostDbRepository } from './repositories/blog-post.db.repository';
import { BlogPostQuery } from './query/blog-post.query';

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

  public async createPost<T extends PostTypeEnum>(authorId: string, dto: BlogPostDtoGeneric<T>) {
    return await this.repository.create({ ...dto, tags: dto.tags?.map((t) => t.toLowerCase()), authorId });
  }

  public async deletePost(authorId: string, postId: string) {
    const post = await this.repository.get(postId);

    if (post?.authorId === authorId) {
      await this.repository.delete(post.id);
    }

    throw new NotFoundException();
  }

  public async updatePost<T extends PostTypeEnum>(authorId: string, postId: string, dto: BlogPostDtoGeneric<T>) {
    const post = await this.repository.get(postId);

    if (post?.authorId === authorId) {
      return await this.repository.update(post.id, { ...dto, tags: dto.tags?.map((t) => t.toLowerCase()) });
    }
    throw new NotFoundException();
  }

  public async listPosts(query: BlogPostQuery) {
    return await this.repository.list(query);
  }
}
