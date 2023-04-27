import { Post } from './post';
import {PostTypeEnum} from "./post.type.enum";

export abstract class PostVideo extends Post {
  public name!: string;

  public linkUrl!: string;

  public override type: PostTypeEnum.VIDEO = PostTypeEnum.VIDEO;
}
