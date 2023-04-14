import { PostTypeEnum, PostGeneric, PostUnion } from "@project/shared/app-types";
import { BlogPostDtoGeneric } from '../dto';

export type ListBlogPostRepositoryParams = {
  ids?: string[];
  type?: PostTypeEnum;
};

export interface BlogPostRepository {
  get(id: string): Promise<PostUnion | null>;

  create<T extends PostTypeEnum>(post: BlogPostDtoGeneric<T>): Promise<PostGeneric<T>>;

  update<T extends PostTypeEnum>(id: string, post: BlogPostDtoGeneric<T>): Promise<PostGeneric<T>>;

  delete(id: string): Promise<void>;

  list(params: ListBlogPostRepositoryParams): Promise<PostUnion[]>;
}
