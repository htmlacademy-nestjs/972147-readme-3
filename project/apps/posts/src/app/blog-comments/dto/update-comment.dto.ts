import { ApiProperty } from "@nestjs/swagger";

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Text of the comment',
    example: 'This is a comment'
  })
  public text!: string;
}
