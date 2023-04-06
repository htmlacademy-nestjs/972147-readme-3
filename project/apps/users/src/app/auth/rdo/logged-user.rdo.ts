import { Expose } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger";

export class LoggedUserRdo {
  @ApiProperty({
    description: 'User unique ID',
    example: '5ebc9b18-6564-4dec-b559-10402a71ab36'
  })
  @Expose()
  public id!: string;

  @ApiProperty({
    description: 'User email',
    example: 'test@example.com'
  })
  @Expose()
  public email!: string;

  @ApiProperty({
    description: 'Token to access the API',
    example: '5ebc9b18-6564-4dec-b559-10402a71ab36'
  })
  @Expose()
  public accessToken!: string;

  @ApiProperty({
    description: 'Token to refresh the access token',
    example: '5ebc9b18-6564-4dec-b559-10402a71ab36'
  })
  @Expose()
  public refreshToken!: string;
}
