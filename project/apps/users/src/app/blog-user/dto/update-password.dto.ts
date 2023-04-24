import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Old user password',
    example: '123456'
  })
  @IsString()
  @IsNotEmpty()
  public oldPassword!: string;

  @ApiProperty({
    description: 'New password for user',
    example: '654321'
  })
  @IsString()
  @MinLength(6)
  @MaxLength(12)
  public newPassword!: string;
}
