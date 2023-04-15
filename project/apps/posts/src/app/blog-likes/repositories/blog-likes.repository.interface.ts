export interface LikeParams {
  authorId: string;
  postId: string;
}

export interface BlogLikesRepositoryInterface {
  create(params: LikeParams): Promise<void>;

  delete(params: LikeParams): Promise<void>;
}
