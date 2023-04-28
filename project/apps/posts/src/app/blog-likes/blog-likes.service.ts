import { Injectable } from '@nestjs/common';
import { BlogLikesDbRepository } from "./repositories/blog-likes.db.repository";

@Injectable()
export class BlogLikesService {
  constructor(private readonly repository: BlogLikesDbRepository) {}

  public async likePost(authorId: string, postId: string) {
    await this.repository.create({ authorId, postId });
  }

  public async unlikePost(authorId: string, postId: string) {
    await this.repository.delete({ authorId, postId });
  }
}
