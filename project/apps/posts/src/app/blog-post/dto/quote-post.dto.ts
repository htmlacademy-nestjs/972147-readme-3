import { ApiProperty } from "@nestjs/swagger";
import { PostTypeEnum } from "@project/shared/app-types";
import { Expose } from "class-transformer";

export class QuotePostDto {
  @ApiProperty({
    description: 'Text of the quote',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  })
  public text!: string;

  @ApiProperty({
    description: 'Author of the quote',
    example: 'John Doe'
  })
  public quoteAuthor!: string;

  @ApiProperty({
    description: 'Type of the post',
    example: PostTypeEnum.QUOTE,
  })
  @Expose()
  public type: PostTypeEnum.QUOTE = PostTypeEnum.QUOTE;
}
