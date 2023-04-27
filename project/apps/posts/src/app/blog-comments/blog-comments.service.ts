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

  public async createComment(dto: CreateCommentDto) {
    return await this.repository.create({ ...dto, authorId: 'some author id' }); // TODO: get author id from context
  }

  public async deleteComment(id: string) {
    const comment = this.repository.get(id);

    if (!comment) {
      throw new NotFoundException();
    }

    await this.repository.delete(id);
  }

  public async updateComment(id: string, dto: UpdateCommentDto) {
    const comment = this.repository.get(id);

    if (!comment) {
      throw new NotFoundException();
    }

    return await this.repository.update(id, dto);
  }

  public async getCommentsList(query: BlogCommentQuery) {
    return await this.repository.list(query);
  }
}
