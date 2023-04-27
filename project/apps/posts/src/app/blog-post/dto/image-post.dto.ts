import { ApiProperty } from "@nestjs/swagger";
import { PostTypeEnum } from "@project/shared/app-types";
import { PostDto } from "./post.dto";
import { Equals, IsNotEmpty, IsString } from "class-validator";

export class ImagePostDto extends PostDto {
  @ApiProperty({
    description: 'Image file id',
    example: '5e1f5b9b-8c9b-4b9f-8c9b-4b9f5b9b8c9b',
  })
  @IsString()
  @IsNotEmpty()
  public imageFileId!: string;

  @ApiProperty({
    description: 'Type of the post',
    example: PostTypeEnum.IMAGE,
  })
  @Equals(PostTypeEnum.IMAGE)
  public type: PostTypeEnum.IMAGE = PostTypeEnum.IMAGE;
}
