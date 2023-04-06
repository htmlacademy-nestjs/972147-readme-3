import { Post, PostStateEnum, PostTypeEnum } from "@project/shared/app-types";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export abstract class PostRdo implements Post {
  @ApiProperty({
    description: 'Unique identifier of the post',
    example: '5ebc9b18-6564-4dec-b559-10402a71ab36'
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
    description: 'State of the post',
    enum: PostStateEnum,
    example: PostStateEnum.PUBLISHED,
  })
  @Expose()
  public state!: PostStateEnum;

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
