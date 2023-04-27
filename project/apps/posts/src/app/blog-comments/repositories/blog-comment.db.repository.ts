import { BlogCommentRepositoryInterface, WithAuthorId } from './blog-comment.repository.interface';
import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Comment } from '@project/shared/app-types';
import { PrismaService } from '../../prisma/prisma.service';
import { Comment as DBComment } from '@prisma/client';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { BlogCommentQuery } from '../query/blog-comment.query';

@Injectable()
export class BlogCommentDbRepository implements BlogCommentRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  private mapDbCommentToComment(dbComment: DBComment): Comment {
    return {
      id: dbComment.id,
      text: dbComment.text,
      postId: dbComment.postId,
      updatedAt: dbComment.updatedAt,
      authorId: dbComment.authorId,
      createdAt: dbComment.createdAt,
    };
  }

  public async get(id: string) {
    const dbComment = await this.prisma.comment.findUnique({ where: { id } });

    if (!dbComment) {
      return null;
    }

    return this.mapDbCommentToComment(dbComment);
  }

  public async create(dto: WithAuthorId<CreateCommentDto>): Promise<Comment> {
    const dbComment = await this.prisma.comment.create({
      data: {
        text: dto.text,
        postId: dto.postId,
        authorId: dto.authorId,
      },
    });
    return this.mapDbCommentToComment(dbComment);
  }

  public async update(id: string, dto: UpdateCommentDto): Promise<Comment> {
    const dbComment = await this.prisma.comment.update({
      where: { id },
      data: { text: dto.text },
    });
    return this.mapDbCommentToComment(dbComment);
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.comment.delete({ where: { id } });
  }

  public async list(query: BlogCommentQuery): Promise<Comment[]> {
    const { postId, page, limit } = query;
    const dbComments = await this.prisma.comment.findMany({
      where: {
        postId: {
          equals: postId,
        },
      },
      take: limit,
      skip: page > 0 ? limit * (page - 1) : undefined,
    });
    return dbComments.map(this.mapDbCommentToComment);
  }
}
