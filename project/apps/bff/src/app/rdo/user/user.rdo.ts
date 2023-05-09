import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class UserRdo {
  @ApiProperty({
    description: 'User unique ID',
    example: '5f9c1b9b9c9d1b1b8c8c8c8c'
  })
  @Expose()
  public id!: string;

  @ApiProperty({
    description: 'User firstname',
    example: 'Ivan'
  })
  @Expose()
  public firstname!: string;

  @ApiProperty({
    description: 'User lastname',
    example: 'Ivanov'
  })
  @Expose()
  public lastname!: string;

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
    description: 'Count of user posts',
    example: 12
  })
  @Expose()
  public postsCount!: number;

  @ApiProperty({
    description: 'Count of user subscribers',
    example: 12
  })
  @Expose()
  public subscribersCount!: number;
}
