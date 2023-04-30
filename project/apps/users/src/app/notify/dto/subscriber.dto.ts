import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SubscriberDto {
  @IsEmail()
  public email!: string;

  @IsString()
  @IsNotEmpty()
  public firstname!: string;

  @IsString()
  @IsNotEmpty()
  public lastname!: string;
}
