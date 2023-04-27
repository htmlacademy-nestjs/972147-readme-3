import { ApiProperty } from "@nestjs/swagger";
import { PostTypeEnum } from "@project/shared/app-types";
import { PostDto } from "./post.dto";
import { Equals, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class LinkPostDto extends PostDto {
  @ApiProperty({
    description: 'Link to be shared as post',
    example: 'https://www.google.com'
  })
  @IsUrl()
  public linkUrl!: string;

  @ApiProperty({
    description: 'Description to link',
    example: 'Google search'
  })
  @IsString()
  @IsOptional()
  @MaxLength(300)
  public description?: string;

  @ApiProperty({
    description: 'Type of the post',
    example: PostTypeEnum.LINK,
  })
  @Equals(PostTypeEnum.LINK)
  public type: PostTypeEnum.LINK = PostTypeEnum.LINK;
}
