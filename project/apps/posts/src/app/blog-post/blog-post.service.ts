import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PostTypeEnum } from '@project/shared/app-types';
import { BlogPostDtoGeneric, DeletePostDto } from './dto';
import { BlogPostDbRepository } from './repositories/blog-post.db.repository';
import { BlogPostQuery } from './query/blog-post.query';
import { CreateRepostDto } from "./dto/create-repost.dto";

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
    return await this.repository.create({ ...dto, tags: dto.tags?.map((t) => t.toLowerCase()) });
  }

  public async deletePost(dto: DeletePostDto) {
    const post = await this.repository.get(dto.postId);

    if (!post) {
      throw new NotFoundException();
    }

    if (post.authorId === dto.authorId) {
      return await this.repository.delete(post.id);
    }

    throw new BadRequestException();
  }

  public async updatePost<T extends PostTypeEnum>(postId: string, dto: BlogPostDtoGeneric<T>) {
    const post = await this.repository.get(postId);

    if (!post) {
      throw new NotFoundException();
    }

    if (post.authorId === dto.authorId) {
      return await this.repository.update(post.id, { ...dto, tags: dto.tags?.map((t) => t.toLowerCase()) });
    }

    throw new BadRequestException();
  }

  public async listPosts(query: BlogPostQuery) {
    return await this.repository.list(query);
  }

  public createRepost(dto: CreateRepostDto) {
    return this.repository.createRepost(dto);
  }

  public async getPostsCountByAuthorId(authorId: string) {
    return await this.repository.getCountByAuthorId(authorId);
  }
}
