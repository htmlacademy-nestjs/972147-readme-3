import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class UserRdo {
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

  @ApiProperty({
    description: 'Avatar file id',
    example: '5f9c1b9b9c9d1b1b8c8c8c8c'
  })
  @Expose()
  public avatarFileId?: string;

  @ApiProperty({
    description: 'User registration date',
    example: '2020-01-01T00:00:00.000Z'
  })
  @Expose()
  public registeredAt!: Date;

  @ApiProperty({
    description: 'User posts count',
    example: '12'
  })
  @Expose()
  public postsCount!: number;

  @ApiProperty({
    description: 'User subscribers count',
    example: '10'
  })
  @Expose()
  public subscribersCount!: number;
}
