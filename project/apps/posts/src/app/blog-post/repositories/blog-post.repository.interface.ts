import { PostTypeEnum, PostGeneric } from "@project/shared/app-types";
import { BlogPostEntityGeneric } from '../entities';
import { CrudRepository } from "@project/util/util-types";

//eslint-disable-next-line
export interface BlogPostRepository<T extends PostTypeEnum> extends CrudRepository<string, BlogPostEntityGeneric<T>, PostGeneric<T>> {

}

export interface BlogPostRepositoryFactory {
  getRepository<T extends PostTypeEnum>(type: T): BlogPostRepository<T>;
}
