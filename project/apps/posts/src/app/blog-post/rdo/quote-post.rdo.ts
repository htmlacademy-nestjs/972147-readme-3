import { PostRdo } from "./post.rdo";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class QuotePostRdo extends PostRdo {
  @ApiProperty({
    description: 'Text of the quote',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  })
  @Expose()
  public text!: string;

  @ApiProperty({
    description: 'Author of the quote',
    example: 'John Doe'
  })
  @Expose()
  public quoteAuthor!: string;
}
