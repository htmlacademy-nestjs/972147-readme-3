import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ArrayMaxSize, IsDate, IsOptional, IsString, Length, Matches, NotContains } from 'class-validator';

export class PostDto {
  @ApiProperty({
    description: 'Post publication date',
    example: '2020-01-01T00:00:00.000Z',
  })
  @Expose()
  @IsDate()
  @IsOptional()
  public publishedAt?: Date;

  @ApiProperty({
    description: 'Tags of the post',
    example: ['django', 'python'],
  })
  @Expose()
  @IsString({ each: true })
  @Length(3, 10, { each: true })
  @NotContains(' ', { each: true })
  @ArrayMaxSize(8)
  @Matches(/^D/, {
    each: true,
    message: 'the first character of tag must not be a number',
  })
  @IsOptional()
  public tags?: string[];
}
