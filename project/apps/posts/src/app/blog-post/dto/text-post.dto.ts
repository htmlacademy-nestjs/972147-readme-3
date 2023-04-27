import { ApiProperty } from "@nestjs/swagger";
import { PostTypeEnum } from "@project/shared/app-types";
import { PostDto } from "./post.dto";
import { Equals, IsString, MaxLength, MinLength } from "class-validator";

export class TextPostDto extends PostDto {
  @ApiProperty({
    description: 'Post name',
    example: 'Some post name'
  })
  @IsString()
  @MinLength(20)
  @MaxLength(50)
  public name!: string;

  @ApiProperty({
    description: 'Post name',
    example: 'Some post name'
  })
  @IsString()
  @MinLength(50)
  @MaxLength(255)
  public announceText!: string;

  @ApiProperty({
    description: 'Post name',
    example: 'Some post name'
  })
  @IsString()
  @MinLength(100)
  @MaxLength(1024)
  public mainText!: string;

  @ApiProperty({
    description: 'Type of the post',
    example: PostTypeEnum.TEXT,
  })
  @Equals(PostTypeEnum.TEXT)
  public type: PostTypeEnum.TEXT = PostTypeEnum.TEXT;
}
