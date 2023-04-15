import { Expose } from "class-transformer";
import { PostRdo } from "./post.rdo";
import { ApiProperty } from "@nestjs/swagger";
import { PostTypeEnum } from "@project/shared/app-types";

export class LinkPostRdo extends PostRdo {
  @ApiProperty({
    description: 'Link to be shared as post',
    example: 'https://www.google.com'
  })
  @Expose()
  public link!: string;

  @ApiProperty({
    description: 'Description to link',
    example: 'Google search'
  })
  @Expose()
  public description?: string;

  @ApiProperty({
    description: 'Type of the post',
    example: PostTypeEnum.LINK,
  })
  @Expose()
  public type: PostTypeEnum.LINK = PostTypeEnum.LINK;
}
