import { ApiProperty } from "@nestjs/swagger";

export class ImagePostDto {
  @ApiProperty({
    description: 'Link to image',
    example: 'https://example.com/image.png'
  })
  public imageUrl!: string;
}
