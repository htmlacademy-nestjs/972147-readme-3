import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty({
    description: 'Post publication date',
    example: '2020-01-01T00:00:00.000Z',
  })
  public publishedAt?: Date;

  @ApiProperty({
    description: 'Tags of the post',
    example: ['django', 'python'],
  })
  public tags?: string[];
}
