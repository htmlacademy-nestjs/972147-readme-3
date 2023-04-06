import { PostGeneric, PostTypeEnum } from "@project/shared/app-types";
import { BlogPostTextEntity } from "./blog-post.text.entity";
import { BlogPostVideoEntity } from "./blog-post.video.entity";
import { BlogPostQuoteEntity } from "./blog-post.quote.entity";
import { BlogPostImageEntity } from "./blog-post.image.entity";
import { BlogPostLinkEntity } from "./blog-post.link.entity";

export type BlogPostEntityMap = {
  [PostTypeEnum.TEXT]: BlogPostTextEntity,
  [PostTypeEnum.VIDEO]: BlogPostVideoEntity,
  [PostTypeEnum.QUOTE]: BlogPostQuoteEntity,
  [PostTypeEnum.IMAGE]: BlogPostImageEntity,
  [PostTypeEnum.LINK]: BlogPostLinkEntity,
};

export type BlogPostEntityGeneric<T extends PostTypeEnum> = T extends keyof BlogPostEntityMap ? BlogPostEntityMap[T] : never;

export const createBlogPostEntity = <T extends PostTypeEnum>(post: PostGeneric<T>) => {
  switch (post.type) {
    case PostTypeEnum.TEXT:
      return BlogPostTextEntity.create(post);
    case PostTypeEnum.VIDEO:
      return BlogPostVideoEntity.create(post);
    case PostTypeEnum.IMAGE:
      return BlogPostImageEntity.create(post);
    case PostTypeEnum.QUOTE:
      return BlogPostQuoteEntity.create(post);
    case PostTypeEnum.LINK:
      return BlogPostLinkEntity.create(post);
    default:
      throw new Error('Invalid post type');
  }
};
