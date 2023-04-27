import { ApiProperty } from "@nestjs/swagger";
import { PostTypeEnum } from "@project/shared/app-types";
import { PostDto } from "./post.dto";
import { Equals, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class VideoPostDto extends PostDto {
  @ApiProperty({
    description: 'Video post name',
    example: 'Funny cat video'
  })
  @IsString()
  @MinLength(20)
  @MaxLength(50)
  public name!: string;

  @ApiProperty({
    description: 'Link to video',
    example: 'https://www.youtube.com/watch?v=QH2-TGUlwu4'
  })
  @IsUrl()
  public linkUrl!: string;

  @ApiProperty({
    description: 'Type of the post',
    example: PostTypeEnum.VIDEO,
  })
  @Equals(PostTypeEnum.VIDEO)
  public type: PostTypeEnum.VIDEO = PostTypeEnum.VIDEO;
}
