import { ApiProperty } from "@nestjs/swagger";

export class LoginUserRdo {
  @ApiProperty({
    description: 'Token to access the API',
    example: '5ebc9b18-6564-4dec-b559-10402a71ab36'
  })
  public accessToken!: string;

  @ApiProperty({
    description: 'Token to refresh the access token',
    example: '5ebc9b18-6564-4dec-b559-10402a71ab36'
  })
  public refreshToken!: string;
}
