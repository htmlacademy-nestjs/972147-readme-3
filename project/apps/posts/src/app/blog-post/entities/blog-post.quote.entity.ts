import { PostQuote } from "@project/shared/app-types";
import { plainToInstance } from "class-transformer";

export class BlogPostQuoteEntity extends PostQuote {
  public static create(post: PostQuote): BlogPostQuoteEntity {
    return plainToInstance(BlogPostQuoteEntity, post);
  }

  public toObject(): PostQuote {
    return { ...this };
  }
}
