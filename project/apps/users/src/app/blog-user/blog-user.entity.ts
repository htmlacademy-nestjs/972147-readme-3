import { User } from '@project/shared/app-types';
import { fillObject } from '@project/util/util-core';
import { compare, genSalt, hash } from 'bcrypt';
import { SALT_ROUNDS } from "./blog-user.config";

export class BlogUserEntity extends User {
  private _passwordHash!: string;

  public async setPassword(password: string): Promise<BlogUserEntity> {
    const salt = await genSalt(SALT_ROUNDS);
    this._passwordHash = await hash(password, salt);
    return this;
  }

  public async checkPassword(password: string): Promise<boolean> {
    return compare(password, this._passwordHash)
  }

  public static create(user: User): BlogUserEntity {
    return fillObject(BlogUserEntity, user);
  }

  public toObject(): User {
    return {...this};
  }
}
