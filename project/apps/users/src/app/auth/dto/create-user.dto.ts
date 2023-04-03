import { User } from "@project/shared/app-types";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto implements Partial<User> {
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
