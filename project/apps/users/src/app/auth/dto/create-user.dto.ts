import { User } from "@project/shared/app-types";

export class CreateUserDto implements Partial<User> {
  public firstName!: string;

  public lastName!: string;

  public email!: string;

  public password!: string;
}
