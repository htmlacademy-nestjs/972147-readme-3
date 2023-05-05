import { Injectable } from '@nestjs/common';
import { BlogLikesDbRepository } from './repositories/blog-likes.db.repository';
import { LikeDto } from './dto/like.dto';

@Injectable()
export class BlogLikesService {
  constructor(private readonly repository: BlogLikesDbRepository) {}

  public async likePost(dto: LikeDto) {
    await this.repository.create(dto);
  }

  public async unlikePost(dto: LikeDto) {
    await this.repository.delete(dto);
  }
}
