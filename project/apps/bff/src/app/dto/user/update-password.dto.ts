import { ApiProperty } from "@nestjs/swagger";

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Old user password',
    example: '123456'
  })
  public oldPassword!: string;

  @ApiProperty({
    description: 'New password for user',
    example: '654321'
  })
  public newPassword!: string;
}
