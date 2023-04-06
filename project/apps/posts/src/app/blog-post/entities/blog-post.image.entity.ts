import { PostImage } from "@project/shared/app-types";
import { plainToInstance } from "class-transformer";

export class BlogPostImageEntity extends PostImage {
  public static create(post: PostImage): BlogPostImageEntity {
    return plainToInstance(BlogPostImageEntity, post);
  }

  public toObject(): PostImage {
    return { ...this };
  }
}
