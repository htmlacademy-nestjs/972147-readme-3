import { PostTypeEnum, PostGeneric } from "@project/shared/app-types";
import { CrudRepository } from "@project/util/util-types";
import { BlogPostDtoGeneric } from "../dto";

//eslint-disable-next-line
export interface BlogPostRepository<T extends PostTypeEnum> extends CrudRepository<string, BlogPostDtoGeneric<T>, BlogPostDtoGeneric<T>, PostGeneric<T>> {
  list(ids: string[]): Promise<PostGeneric<T>[]>;
}

export interface BlogPostRepositoryFactory {
  getRepository<T extends PostTypeEnum>(type: T): BlogPostRepository<T>;
}
