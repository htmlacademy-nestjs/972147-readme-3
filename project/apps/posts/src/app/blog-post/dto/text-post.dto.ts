import { ApiProperty } from "@nestjs/swagger";
import { PostTypeEnum } from "@project/shared/app-types";
import { Expose } from "class-transformer";
import { PostDto } from "./post.dto";

export class TextPostDto extends PostDto {
  @ApiProperty({
    description: 'Post name',
    example: 'Some post name'
  })
  public name!: string;

  @ApiProperty({
    description: 'Post name',
    example: 'Some post name'
  })
  public announceText!: string;

  @ApiProperty({
    description: 'Post name',
    example: 'Some post name'
  })
  public mainText!: string;

  @ApiProperty({
    description: 'Type of the post',
    example: PostTypeEnum.TEXT,
  })
  @Expose()
  public type: PostTypeEnum.TEXT = PostTypeEnum.TEXT;
}
