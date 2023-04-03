import { User } from "@project/shared/app-types";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto implements Partial<User> {
  @ApiProperty({
    description: 'User firstname',
    example: 'Ivan'
  })
  public firstName!: string;

  @ApiProperty({
    description: 'User lastname',
    example: 'Ivanov'
  })
  public lastName!: string;
}
