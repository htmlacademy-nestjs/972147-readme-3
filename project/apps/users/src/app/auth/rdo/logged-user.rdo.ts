import { Expose } from 'class-transformer';
import { User } from "@project/shared/app-types";

export class LoggedUserRdo implements Partial<User> {
  @Expose()
  public id!: string;

  @Expose()
  public email!: string;

  @Expose()
  public accessToken!: string;

  @Expose()
  public refreshToken!: string;
}
