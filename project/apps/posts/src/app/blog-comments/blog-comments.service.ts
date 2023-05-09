import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { BlogCommentDbRepository } from './repositories/blog-comment.db.repository';
import { BlogCommentQuery } from "./query/blog-comment.query";
import { DeleteCommentDto } from "./dto/delete-comment.dto";

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
    return await this.repository.create({ ...dto });
  }

  public async deleteComment(dto: DeleteCommentDto) {
    const comment = await this.repository.get(dto.commentId);

    if (!comment) {
      throw new NotFoundException();
    }

    if (comment.authorId !== dto.authorId) {
      throw new BadRequestException();
    }

    return await this.repository.delete(dto.commentId);
  }

  public async updateComment(id: string, dto: UpdateCommentDto) {
    const comment = await this.repository.get(id);

    if (!comment) {
      throw new NotFoundException();
    }

    if (comment.authorId !== dto.authorId) {
      throw new BadRequestException();
    }

    return await this.repository.update(id, dto);
  }

  public async getCommentsList(query: BlogCommentQuery) {
    return await this.repository.list(query);
  }
}
