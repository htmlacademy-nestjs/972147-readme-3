import { BlogLikesRepositoryInterface } from './blog-likes.repository.interface';
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from '../../prisma/prisma.service';
import { LikeDto } from "../dto/like.dto";

@Injectable()
export class BlogLikesDbRepository implements BlogLikesRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  public async create({ authorId, postId }: LikeDto): Promise<void> {
    const existingLike = await this.prisma.like.findFirst({ where: { authorId, postId } });
    if (existingLike) {
      throw new ConflictException('Like already exists');
    }
    await this.prisma.like.create({
      data: {
        authorId,
        postId,
      },
    });
  }

  public async delete({ authorId, postId }: LikeDto): Promise<void> {
    const existingLike = await this.prisma.like.findFirst({ where: { authorId, postId } });
    if (!existingLike) {
      throw new NotFoundException('Like does not exist');
    }
    await this.prisma.like.delete({ where: { id: existingLike.id } });
  }
}
