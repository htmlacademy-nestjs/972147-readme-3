import { User } from '@project/shared/app-types';
import { compare, genSalt, hash } from 'bcrypt';
import { SALT_ROUNDS } from "./blog-user.config";
import { plainToInstance } from "class-transformer";

export class BlogUserEntity extends User {
  public async setPassword(password: string): Promise<BlogUserEntity> {
    const salt = await genSalt(SALT_ROUNDS);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public async checkPassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash)
  }

  public static create(user: User): BlogUserEntity {
    return plainToInstance(BlogUserEntity, user);
  }

  public toObject(): User {
    return { ...this };
  }
}
