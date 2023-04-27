import { Post } from './post';
import { PostTypeEnum } from "./post.type.enum";

export abstract class PostImage extends Post {
  public imageFileId!: string;

  public override type: PostTypeEnum.IMAGE = PostTypeEnum.IMAGE;
}
