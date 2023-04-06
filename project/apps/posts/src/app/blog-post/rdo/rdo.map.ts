import { PostTypeEnum } from '@project/shared/app-types';
import { QuotePostRdo } from "./quote-post.rdo";
import { LinkPostRdo } from "./link-post.rdo";
import { ImagePostRdo } from "./image-post.rdo";
import { TextPostRdo } from "./text-post.rdo";
import { VideoPostRdo } from "./video-post.dto";

export const BlogPostRdoMap = {
  [PostTypeEnum.QUOTE]: QuotePostRdo,
  [PostTypeEnum.LINK]: LinkPostRdo,
  [PostTypeEnum.IMAGE]: ImagePostRdo,
  [PostTypeEnum.TEXT]: TextPostRdo,
  [PostTypeEnum.VIDEO]: VideoPostRdo,
} as const;

export type BlogPostRdoGeneric<T extends PostTypeEnum> = T extends keyof typeof BlogPostRdoMap ? typeof BlogPostRdoMap[T] : never;
