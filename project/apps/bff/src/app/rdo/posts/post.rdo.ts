import { Post, PostStatusEnum } from "@project/shared/app-types";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export abstract class PostRdo implements Omit<Post, 'type'> {
  @ApiProperty({
    description: 'Unique identifier of the post',
    example: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p'
  })
  @Expose()
  public id!: string;

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
    description: 'Post publication date',
    example: '2020-01-01T00:00:00.000Z'
  })
  @Expose()
  public publishedAt!: Date;

  @ApiProperty({
    description: 'Unique identifier of the author',
    example: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p'
  })
  @Expose()
  public authorId!: string;

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
    description: 'Unique identifier author of the original post',
    example: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p'
  })
  @Expose()
  public originalAuthorId?: string;

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

  @ApiProperty({
    description: 'Tags of the post',
    example: ['django', 'python'],
  })
  @Expose()
  public tags!: string[];
}
