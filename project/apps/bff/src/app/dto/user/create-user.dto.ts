import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: 'User firstname',
    example: 'Ivan'
  })
  public firstname!: string;

  @ApiProperty({
    description: 'User lastname',
    example: 'Ivanov'
  })
  public lastname!: string;

  @ApiProperty({
    description: 'File with user avatar',
    example: 'avatar.png'
  })
  public avatar?: unknown;

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
  public email!: string;

  @ApiProperty({
    description: 'User password',
    example: '123456'
  })
  public password!: string;
}
