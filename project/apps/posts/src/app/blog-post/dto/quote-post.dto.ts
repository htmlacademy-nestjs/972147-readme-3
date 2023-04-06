import { ApiProperty } from "@nestjs/swagger";

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
}
