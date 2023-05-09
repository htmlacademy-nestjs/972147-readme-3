import { PostRdo } from "./post.rdo";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { PostTypeEnum } from "@project/shared/app-types";

export class TextPostRdo extends PostRdo {
  @ApiProperty({
    description: 'Post name',
    example: 'Some post name'
  })
  @Expose()
  public name!: string;

  @ApiProperty({
    description: 'Announce post text',
    example: 'Some announce post text'
  })
  @Expose()
  public announceText!: string;

  @ApiProperty({
    description: 'Main post text',
    example: 'Some main post text'
  })
  @Expose()
  public mainText!: string;

  @ApiProperty({
    description: 'Type of the post',
    example: PostTypeEnum.TEXT,
  })
  @Expose()
  public type: PostTypeEnum.TEXT = PostTypeEnum.TEXT;
}
