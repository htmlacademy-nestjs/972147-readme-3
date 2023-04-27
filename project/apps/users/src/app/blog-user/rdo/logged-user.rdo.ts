import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class LoggedUserRdo {
  @ApiProperty({
    description: 'User unique ID',
    example: '5ebc9b18-6564-4dec-b559-10402a71ab36'
  })
  @Expose()
  public id!: string;

  @ApiProperty({
    description: 'User firstname',
    example: 'Ivan'
  })
  @Expose()
  public firstName!: string;

  @ApiProperty({
    description: 'User lastname',
    example: 'Ivanov'
  })
  @Expose()
  public lastName!: string;

  @ApiProperty({
    description: 'User email',
    example: 'test@example.com'
  })
  @Expose()
  public email!: string;
}
