import { ApiProperty } from "@nestjs/swagger";
import { PostTypeEnum } from "@project/shared/app-types";
import { PostDto } from "./post.dto";
import { Equals, IsString, MaxLength, MinLength } from "class-validator";

export class QuotePostDto extends PostDto {
  @ApiProperty({
    description: 'Text of the quote',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  })
  @IsString()
  @MinLength(20)
  @MaxLength(300)
  public text!: string;

  @ApiProperty({
    description: 'Author of the quote',
    example: 'John Doe'
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  public quoteAuthor!: string;

  @ApiProperty({
    description: 'Type of the post',
    example: PostTypeEnum.QUOTE,
  })
  @Equals(PostTypeEnum.QUOTE)
  public type: PostTypeEnum.QUOTE = PostTypeEnum.QUOTE;
}
