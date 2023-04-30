import { IsEmail, IsNotEmpty } from 'class-validator';

export class SubscriberDto {
  @IsEmail()
  public email!: string;

  @IsNotEmpty()
  public firstname!: string;

  @IsNotEmpty()
  public lastname!: string;
}
