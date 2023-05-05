import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateCommentDto {
  @ApiProperty({
    description: 'Text of the comment',
    example: 'This is a comment'
  })
  @IsString()
  @MinLength(10)
  @MaxLength(300)
  public text!: string;

  @ApiProperty({
    description: 'Unique identifier of the post',
    example: '5f9b9c0c-9b5c-4b9c-9c0c-9b5c4b9c0c5f'
  })
  @IsString()
  @IsUUID()
  public postId!: string;

  @ApiProperty({
    description: 'Unique identifier author post',
    example: '644e7abb052df2e90a53b3c2',
  })
  @IsString()
  @IsNotEmpty()
  public authorId!: string;
}
