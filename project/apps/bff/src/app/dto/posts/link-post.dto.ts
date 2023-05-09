import { ApiProperty } from "@nestjs/swagger";
import { PostTypeEnum } from "@project/shared/app-types";
import { PostDto } from "./post.dto";

export class LinkPostDto extends PostDto {
  @ApiProperty({
    description: 'Link to be shared as post',
    example: 'https://www.google.com'
  })
  public linkUrl!: string;

  @ApiProperty({
    description: 'Description to link',
    example: 'Google search'
  })
  public description?: string;

  @ApiProperty({
    description: 'Type of the post',
    example: PostTypeEnum.LINK,
  })
  public type: PostTypeEnum.LINK = PostTypeEnum.LINK;
}
