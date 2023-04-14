import { PostVideo } from './post-video';
import { PostImage } from './post-image';
import { PostLink } from './post-link';
import { PostQuote } from './post-quote';
import { PostText } from './post-text';
import { PostTypeEnum } from './post.type.enum';

export type PostUnion = PostText | PostVideo | PostQuote | PostImage | PostLink;

export type PostTypeMap = {
  [PostTypeEnum.TEXT]: PostText;
  [PostTypeEnum.VIDEO]: PostVideo;
  [PostTypeEnum.QUOTE]: PostQuote;
  [PostTypeEnum.IMAGE]: PostImage;
  [PostTypeEnum.LINK]: PostLink;
};

export type PostGeneric<T extends PostTypeEnum> = T extends keyof PostTypeMap
  ? PostTypeMap[T]
  : never;
