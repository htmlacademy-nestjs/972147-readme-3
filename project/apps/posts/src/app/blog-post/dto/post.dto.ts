import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ArrayMaxSize, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches, NotContains } from 'class-validator';
import { PostStatusEnum } from '@project/shared/app-types';

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
  @Matches(/^\D/, {
    each: true,
    message: 'the first character of tag must not be a number',
  })
  @IsOptional()
  public tags?: string[];

  @ApiProperty({
    description: 'Status of the post',
    example: PostStatusEnum.DRAFT,
  })
  @IsEnum(PostStatusEnum)
  public status?: PostStatusEnum = PostStatusEnum.DRAFT;

  @ApiProperty({
    description: 'Unique identifier of the author',
    example: '644e7abb052df2e90a53b3c2',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  public authorId!: string;
}
