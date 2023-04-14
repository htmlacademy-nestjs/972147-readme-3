import { PostRdo } from "./post.rdo";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { PostTypeEnum } from "@project/shared/app-types";

export class ImagePostRdo extends PostRdo {
  @ApiProperty({
    description: 'Link to image',
    example: 'https://example.com/image.png'
  })
  @Expose()
  public imageUrl!: string;

  @ApiProperty({
    description: 'Type of the post',
    example: PostTypeEnum.IMAGE,
  })
  @Expose()
  public type: PostTypeEnum.IMAGE = PostTypeEnum.IMAGE;
}
