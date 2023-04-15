import { PostTypeEnum } from "./post.type.enum";
import { PostStatusEnum } from "./post.status.enum";

export abstract class Post {
  public id!: string;
  public type!: PostTypeEnum;
  public createdAt!: Date;
  public updatedAt!: Date;
  public publishedAt!: Date;
  public status!: PostStatusEnum;
  public authorId!: string;
  public isRepost!: boolean;
  public likesCount!: number;
  public commentsCount!: number;
}
