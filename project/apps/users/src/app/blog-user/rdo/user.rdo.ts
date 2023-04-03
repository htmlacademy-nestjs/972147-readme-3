import { User } from "@project/shared/app-types";
import { Expose } from "class-transformer";

export class UserRdo implements Partial<User> {
  @Expose()
  public id!: string;

  @Expose()
  public firstName!: string;

  @Expose()
  public lastName!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatar?: string;

  @Expose()
  public registeredAt!: Date;

  @Expose()
  public postsCount!: number;

  @Expose()
  public subscribersCount!: number;
}
