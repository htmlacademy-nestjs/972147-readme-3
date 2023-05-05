import { LikeDto } from "../dto/like.dto";

export interface BlogLikesRepositoryInterface {
  create(params: LikeDto): Promise<void>;

  delete(params: LikeDto): Promise<void>;
}
