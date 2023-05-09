import { PostRdo } from "./post.rdo";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { PostTypeEnum } from "@project/shared/app-types";

export class ImagePostRdo extends PostRdo {
  @ApiProperty({
    description: 'Image file id',
    example: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p'
  })
  @Expose()
  public imageFileId!: string;

  @ApiProperty({
    description: 'Type of the post',
    example: PostTypeEnum.IMAGE,
  })
  @Expose()
  public type: PostTypeEnum.IMAGE = PostTypeEnum.IMAGE;
}
