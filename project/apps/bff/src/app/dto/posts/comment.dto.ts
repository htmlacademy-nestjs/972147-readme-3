import { ApiProperty } from "@nestjs/swagger";

export class CommentDto {
  @ApiProperty({
    description: 'Text of the comment',
    example: 'This is a comment'
  })
  public text!: string;
}
