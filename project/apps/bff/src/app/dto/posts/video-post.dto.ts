import { ApiProperty } from '@nestjs/swagger';
import { PostTypeEnum } from '@project/shared/app-types';
import { PostDto } from './post.dto';

export class VideoPostDto extends PostDto {
  @ApiProperty({
    description: 'Video post name',
    example: 'Funny cat video',
  })
  public name!: string;

  @ApiProperty({
    description: 'Link to video',
    example: 'https://www.youtube.com/watch?v=QH2-TGUlwu4',
  })
  public linkUrl!: string;

  @ApiProperty({
    description: 'Type of the post',
    example: PostTypeEnum.VIDEO,
  })
  public type: PostTypeEnum.VIDEO = PostTypeEnum.VIDEO;
}
