import { CrudRepository } from "@project/util/util-types";
import { BlogUserEntity } from "../blog-user.entity";
import { User } from "@project/shared/app-types";

export interface BlogUserRepositoryInterface extends CrudRepository<string, BlogUserEntity, User> {
  findByEmail(email: string): Promise<User | null>;
}
