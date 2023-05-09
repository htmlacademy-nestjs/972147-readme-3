import { PostTypeEnum } from '@project/shared/app-types';
import { QuotePostRdo } from './quote-post.rdo';
import { LinkPostRdo } from './link-post.rdo';
import { ImagePostRdo } from './image-post.rdo';
import { TextPostRdo } from './text-post.rdo';
import { VideoPostRdo } from './video-post.rdo';
import { ClassConstructor } from 'class-transformer';

export const BlogPostRdoMap = {
  [PostTypeEnum.QUOTE]: QuotePostRdo,
  [PostTypeEnum.LINK]: LinkPostRdo,
  [PostTypeEnum.IMAGE]: ImagePostRdo,
  [PostTypeEnum.TEXT]: TextPostRdo,
  [PostTypeEnum.VIDEO]: VideoPostRdo,
} as const;

export type BlogPostRdoMap = typeof BlogPostRdoMap;

export type BlogPostRdoGeneric<T extends keyof BlogPostRdoMap> =
  T extends keyof BlogPostRdoMap ? BlogPostRdoMap[T] : never;

export const getBlogPostRdo = <T extends keyof BlogPostRdoMap>(type: T) =>
  BlogPostRdoMap[type] as unknown as ClassConstructor<BlogPostRdoGeneric<T>>;
