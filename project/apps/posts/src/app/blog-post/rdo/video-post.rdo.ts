import { PostRdo } from "./post.rdo";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { PostTypeEnum } from "@project/shared/app-types";

export class VideoPostRdo extends PostRdo {
  @ApiProperty({
    description: 'Video post name',
    example: 'Funny cat video'
  })
  @Expose()
  public name!: string;

  @ApiProperty({
    description: 'Link to video',
    example: 'https://www.youtube.com/watch?v=QH2-TGUlwu4'
  })
  @Expose()
  public linkUrl!: string;

  @ApiProperty({
    description: 'Type of the post',
    example: PostTypeEnum.VIDEO,
  })
  @Expose()
  public type: PostTypeEnum.VIDEO = PostTypeEnum.VIDEO;
}
