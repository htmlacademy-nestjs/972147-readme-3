import { Injectable } from '@nestjs/common';
import { BlogLikesDbRepository } from "./repositories/blog-likes.db.repository";

@Injectable()
export class BlogLikesService {
  constructor(private readonly repository: BlogLikesDbRepository) {}

  public async likePost(postId: string) {
    await this.repository.create({ authorId: 'Some author id', postId }); //TODO: get author id from context
  }

  public async unlikePost(postId: string) {
    await this.repository.delete({ authorId: 'SOme author id', postId }); //TODO: get author id from context
  }
}
