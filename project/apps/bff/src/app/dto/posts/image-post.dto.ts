import { ApiProperty } from "@nestjs/swagger";
import { PostTypeEnum } from "@project/shared/app-types";
import { PostDto } from "./post.dto";

export class ImagePostDto extends PostDto {
  @ApiProperty({
    description: 'Image of the post',
    example: 'post-image.jpg',
  })
  public image!: unknown;

  public imageFileId!: string;

  @ApiProperty({
    description: 'Type of the post',
    example: PostTypeEnum.IMAGE,
  })
  public type: PostTypeEnum.IMAGE = PostTypeEnum.IMAGE;
}
