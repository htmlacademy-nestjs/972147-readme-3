import { PostRdo } from "./post.rdo";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class ImagePostRdo extends PostRdo {
  @ApiProperty({
    description: 'Link to image',
    example: 'https://example.com/image.png'
  })
  @Expose()
  public imageUrl!: string;
}
