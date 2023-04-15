import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
  @ApiProperty({
    description: 'Text of the comment',
    example: 'This is a comment'
  })
  public text!: string;

  @ApiProperty({
    description: 'Unique identifier of the post',
    example: '5f9b9c0c-9b5c-4b9c-9c0c-9b5c4b9c0c5f'
  })
  public postId!: string;
}
