import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Text of the comment',
    example: 'This is a comment'
  })
  @IsString()
  @MinLength(10)
  @MaxLength(300)
  public text!: string;
}
