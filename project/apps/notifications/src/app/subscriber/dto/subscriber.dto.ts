import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Subscriber } from "@project/shared/app-types";

export class SubscriberDto implements Subscriber {
  @IsEmail()
  public email!: string;

  @IsNotEmpty()
  @IsString()
  public firstname!: string;

  @IsNotEmpty()
  @IsString()
  public lastname!: string;

  @IsString({ each: true })
  @IsArray()
  public userSubscriptions!: string[];

  @IsString()
  @IsNotEmpty()
  public userId!: string;
}
