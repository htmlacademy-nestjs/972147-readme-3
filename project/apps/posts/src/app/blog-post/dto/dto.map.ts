import { PostTypeEnum } from '@project/shared/app-types';
import { QuotePostDto } from "./quote-post.dto";
import { LinkPostDto } from "./link-post.dto";
import { ImagePostDto } from "./image-post.dto";
import { TextPostDto } from "./text-post.dto";
import { VideoPostDto } from "./video-post.dto";

export type BlogPostDtoMap = {
  [PostTypeEnum.QUOTE]: QuotePostDto,
  [PostTypeEnum.LINK]: LinkPostDto,
  [PostTypeEnum.IMAGE]: ImagePostDto,
  [PostTypeEnum.TEXT]: TextPostDto,
  [PostTypeEnum.VIDEO]: VideoPostDto,
};

export type BlogPostDtoGeneric<T extends PostTypeEnum> = T extends keyof BlogPostDtoMap ? BlogPostDtoMap[T] : never;
