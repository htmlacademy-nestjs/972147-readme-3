import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'test@example.com'
  })
  @IsEmail()
  public email!: string;

  @ApiProperty({
    description: 'User password',
    example: '123456'
  })
  @IsString()
  @IsNotEmpty()
  public password!: string;
}
