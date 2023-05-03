import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Text of the comment',
    example: 'This is a comment'
  })
  @IsString()
  @MinLength(10)
  @MaxLength(300)
  public text!: string;

  @ApiProperty({
    description: 'Unique identifier author post',
    example: '644e7abb052df2e90a53b3c2',
  })
  @IsString()
  @IsNotEmpty()
  public authorId!: string;
}
