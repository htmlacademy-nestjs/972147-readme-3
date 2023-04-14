import { ApiProperty } from "@nestjs/swagger";
import { PostTypeEnum } from "@project/shared/app-types";
import { Expose } from "class-transformer";

export class ImagePostDto {
  @ApiProperty({
    description: 'Link to image',
    example: 'https://example.com/image.png'
  })
  public imageUrl!: string;

  @ApiProperty({
    description: 'Type of the post',
    example: PostTypeEnum.IMAGE,
  })
  @Expose()
  public type: PostTypeEnum.IMAGE = PostTypeEnum.IMAGE;
}
