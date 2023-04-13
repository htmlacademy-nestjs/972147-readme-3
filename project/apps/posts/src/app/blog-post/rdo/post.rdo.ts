import { Post, PostStatusEnum, PostTypeEnum } from "@project/shared/app-types";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export abstract class PostRdo implements Post {
  @ApiProperty({
    description: 'Unique identifier of the post',
    example: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p'
  })
  @Expose()
  public id!: string;

  @ApiProperty({
    description: 'Type of the post',
    enum: PostTypeEnum,
    example: PostTypeEnum.TEXT,
  })
  @Expose()
  public type!: PostTypeEnum;

  @ApiProperty({
    description: 'Post creation date',
    example: '2020-01-01T00:00:00.000Z'
  })
  @Expose()
  public createdAt!: Date;

  @ApiProperty({
    description: 'Post last update date',
    example: '2020-01-01T00:00:00.000Z'
  })
  @Expose()
  public updatedAt!: Date;

  @ApiProperty({
    description: 'Status of the post',
    enum: PostStatusEnum,
    example: PostStatusEnum.PUBLISHED,
  })
  @Expose()
  public status!: PostStatusEnum;

  @ApiProperty({
    description: 'Is post a repost',
    example: false
  })
  @Expose()
  public isRepost!: boolean;

  @ApiProperty({
    description: 'Count of likes',
    example: 12
  })
  @Expose()
  public likesCount!: number;

  @ApiProperty({
    description: 'Count of comments',
    example: 10
  })
  @Expose()
  public commentsCount!: number;
}
