import { Post } from './post';
import { PostTypeEnum } from "./post.type.enum";

export abstract class PostQuote extends Post {
  public text: string;

  public quoteAuthor: string;

  public override type: PostTypeEnum.QUOTE;
}
