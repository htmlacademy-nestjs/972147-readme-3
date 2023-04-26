import { PostTypeEnum, PostGeneric, PostUnion } from "@project/shared/app-types";
import { BlogPostDtoGeneric } from '../dto';
import { BlogPostQuery } from "../query/blog-post.query";

export type PostAuthor = {
  authorId: string;
}

export interface BlogPostRepository {
  get(id: string): Promise<PostUnion | null>;

  create<T extends PostTypeEnum>(post: BlogPostDtoGeneric<T, PostAuthor>): Promise<PostGeneric<T>>;

  update<T extends PostTypeEnum>(id: string, post: BlogPostDtoGeneric<T>): Promise<PostGeneric<T>>;

  delete(id: string): Promise<void>;

  list(query: BlogPostQuery): Promise<PostUnion[]>;
}
