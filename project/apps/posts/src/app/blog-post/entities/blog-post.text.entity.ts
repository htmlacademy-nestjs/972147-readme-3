import { PostText } from "@project/shared/app-types";
import { plainToInstance } from "class-transformer";

export class BlogPostTextEntity extends PostText {
  public static create(post: PostText): BlogPostTextEntity {
    return plainToInstance(BlogPostTextEntity, post);
  }

  public toObject(): PostText {
    return { ...this };
  }
}
