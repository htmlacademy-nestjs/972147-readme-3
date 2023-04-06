import { PostVideo } from "@project/shared/app-types";
import { plainToInstance } from "class-transformer";

export class BlogPostVideoEntity extends PostVideo {
  public static create(post: PostVideo): BlogPostVideoEntity {
    return plainToInstance(BlogPostVideoEntity, post);
  }

  public toObject(): PostVideo {
    return { ...this };
  }
}
