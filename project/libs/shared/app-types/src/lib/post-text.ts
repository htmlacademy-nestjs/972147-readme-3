import { Post } from './post';
import { PostTypeEnum } from "./post.type.enum";

export abstract class PostText extends Post {
  public name!: string;

  public announceText!: string;

  public mainText!: string;

  public override type: PostTypeEnum.TEXT = PostTypeEnum.TEXT;
}
