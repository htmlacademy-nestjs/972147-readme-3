import { ApiProperty } from "@nestjs/swagger";
import { PostTypeEnum } from "@project/shared/app-types";
import { PostDto } from "./post.dto";

export class ImagePostDto extends PostDto {
  @ApiProperty({
    description: 'Link to image',
    example: 'https://example.com/image.png'
  })
  public imageUrl!: string;

  @ApiProperty({
    description: 'Type of the post',
    example: PostTypeEnum.IMAGE,
  })
  public type: PostTypeEnum.IMAGE = PostTypeEnum.IMAGE;
}
