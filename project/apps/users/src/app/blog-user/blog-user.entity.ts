import { User } from '@project/shared/app-types';
import { compare, genSalt, hash } from 'bcrypt';
import { SALT_ROUNDS } from "./blog-user.config";

export class BlogUserEntity extends User {
  constructor(user: User) {
    super();
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.passwordHash = user.passwordHash;
    this.email = user.email;
    this.avatar = user.avatar;
    this.registeredAt = user.registeredAt;
    this.postsCount = user.postsCount;
    this.subscribersCount = user.subscribersCount;
  }

  public async setPassword(password: string): Promise<BlogUserEntity> {
    const salt = await genSalt(SALT_ROUNDS);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public async checkPassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash)
  }

  public toObject(): User {
    return { ...this };
  }
}
