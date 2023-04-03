import { User } from "@project/shared/app-types";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto implements Partial<User> {
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
