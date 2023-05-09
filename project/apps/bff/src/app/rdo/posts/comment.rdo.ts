import { Comment } from "@project/shared/app-types";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CommentRdo implements Comment {
  @ApiProperty({
    description: 'Unique identifier of the comment',
    example: '5f9b9c0c-9b5c-4b9c-9c0c-9b5c4b9c0c5f'
  })
  @Expose()
  public id!: string;

  @ApiProperty({
    description: 'Text of the comment',
    example: 'This is a comment'
  })
  @Expose()
  public text!: string;

  @ApiProperty({
    description: 'Unique identifier of the post',
    example: '5f9b9c0c-9b5c-4b9c-9c0c-9b5c4b9c0c5f'
  })
  @Expose()
  public postId!: string;

  @ApiProperty({
    description: 'Comment creation date',
    example: '2020-01-01T00:00:00.000Z'
  })
  @Expose()
  public createdAt!: Date;

  @ApiProperty({
    description: 'Comment update date',
    example: '2020-01-01T00:00:00.000Z'
  })
  @Expose()
  public updatedAt!: Date;

  @ApiProperty({
    description: 'Unique identifier of the author',
    example: '5f9b9c0c-9b5c-4b9c-9c0c-9b5c4b9c0c5f'
  })
  @Expose()
  public authorId!: string;
}
