import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { BlogCommentDbRepository } from './repositories/blog-comment.db.repository';
import { BlogCommentQuery } from "./query/blog-comment.query";

@Injectable()
export class BlogCommentsService {
  constructor(private readonly repository: BlogCommentDbRepository) {}

  public getComment(id: string) {
    const comment = this.repository.get(id);

    if (!comment) {
      throw new NotFoundException();
    }

    return comment;
  }

  public async createComment(authorId: string, dto: CreateCommentDto) {
    return await this.repository.create({ ...dto, authorId });
  }

  public async deleteComment(authorId: string, commentId: string) {
    const comment = await this.repository.get(commentId);

    if (comment?.authorId === authorId) {
      await this.repository.delete(commentId);
    }

    throw new NotFoundException();
  }

  public async updateComment(authorId: string, id: string, dto: UpdateCommentDto) {
    const comment = await this.repository.get(id);

    if (comment?.authorId === authorId) {
      return await this.repository.update(id, dto);
    }
    throw new NotFoundException();
  }

  public async getCommentsList(query: BlogCommentQuery) {
    return await this.repository.list(query);
  }
}
