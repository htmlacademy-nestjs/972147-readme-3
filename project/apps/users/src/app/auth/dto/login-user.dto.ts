import { User } from "@project/shared/app-types";

export class LoginUserDto implements Partial<User> {
  public email!: string;

  public password!: string;
}
