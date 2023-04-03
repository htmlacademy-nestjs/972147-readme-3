import { PostTypeEnum } from "./post.type.enum";
import { PostStateEnum } from "./post.state.enum";
import { Author } from "./author";

export abstract class Post {
  public id: string;
  public type: PostTypeEnum;
  public createdAt: Date;
  public updatedAt: Date;
  public state: PostStateEnum;
  public isRepost: boolean;
  public likesCount: number;
  public commentsCount: number;
  public author: Author;
}