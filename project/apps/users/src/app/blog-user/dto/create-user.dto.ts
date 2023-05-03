import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: 'User firstname',
    example: 'Ivan'
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  public firstname!: string;

  @ApiProperty({
    description: 'User lastname',
    example: 'Ivanov'
  })
  @MinLength(1)
  @MaxLength(50)
  public lastname!: string;

  @ApiProperty({
    description: 'User avatar id',
    example: '5f9c1b9b9c9d1b1b8c8c8c8c'
  })
  @IsString()
  @IsOptional()
  public avatarFileId?: string;

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
  @MinLength(6)
  @MaxLength(12)
  public password!: string;
}
