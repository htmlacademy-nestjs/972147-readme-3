import { PostLink } from "@project/shared/app-types";
import { plainToInstance } from "class-transformer";

export class BlogPostLinkEntity extends PostLink {
  public static create(post: PostLink): BlogPostLinkEntity {
    return plainToInstance(BlogPostLinkEntity, post);
  }

  public toObject(): PostLink {
    return { ...this };
  }
}
