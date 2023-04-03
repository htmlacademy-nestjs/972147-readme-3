import { User } from "@project/shared/app-types";

export class UpdateUserDto implements Partial<User> {
  public firstName!: string;

  public lastName!: string;
}
