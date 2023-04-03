import { Post } from './post';
import { PostTypeEnum } from "./post.type.enum";

export abstract class PostLink extends Post {
  public link: string;

  public description?: string;

  public override type: PostTypeEnum.LINK;
}
