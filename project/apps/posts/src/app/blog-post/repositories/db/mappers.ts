import { PostMetadata, PostStatus } from "@prisma/client";
import { Post, PostStatusEnum } from "@project/shared/app-types";

export const dbPostStatusToPostStatusEnum = (status: PostStatus): PostStatusEnum => {
  switch (status) {
    case 'DRAFT':
      return PostStatusEnum.DRAFT;
    case 'PUBLISHED':
      return PostStatusEnum.PUBLISHED;
    default:
      throw new Error('Invalid post status');
  }
}

export const postStatusToDbPostStatus = (status: PostStatusEnum): PostStatus => {
  switch (status) {
    case PostStatusEnum.PUBLISHED:
      return 'PUBLISHED';
    case PostStatusEnum.DRAFT:
      return 'DRAFT';
    default:
      throw new Error('Invalid post status');
  }
}

export const dbPostMetadataToPost = (
  {
    isRepost,
    status,
    updatedAt,
    createdAt
  }: PostMetadata): Omit<Post, 'id' | 'type'> => ({
  isRepost, status: dbPostStatusToPostStatusEnum(status), commentsCount: 0, likesCount: 0, createdAt, updatedAt
});
