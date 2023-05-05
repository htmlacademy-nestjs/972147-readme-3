import { PostTypeEnum } from "@project/shared/app-types";
import { Transform } from "class-transformer";
import { IsEnum, IsIn, IsNumber, IsOptional, IsString } from "class-validator";

const DEFAULT_POST_COUNT_LIMIT = 25;
const DEFAULT_POST_PAGE = 1;
const DEFAULT_POST_SORT_DIRECTION = 'desc';
const DEFAULT_POST_SORT_BY = 'published';

export class BlogPostQuery {
  @Transform(({ value } ) => +value || DEFAULT_POST_COUNT_LIMIT)
  @IsNumber()
  @IsOptional()
  public limit = DEFAULT_POST_COUNT_LIMIT;

  @Transform(({ value }) => +value || DEFAULT_POST_PAGE)
  @IsNumber()
  @IsOptional()
  public page: number = DEFAULT_POST_PAGE;

  @IsOptional()
  @IsEnum(PostTypeEnum)
  public type?: PostTypeEnum;

  @IsOptional()
  @IsString({each: true})
  public authorIds?: string[];

  @Transform(({ value }) => value || DEFAULT_POST_SORT_BY)
  @IsOptional()
  @IsIn(['comments', 'likes', 'published'])
  public sortBy: 'comments' | 'likes' | 'published' = DEFAULT_POST_SORT_BY;

  @Transform(({ value }) => value || DEFAULT_POST_SORT_DIRECTION)
  @IsOptional()
  @IsIn(['asc', 'desc'])
  public sortDirection: 'asc' | 'desc' = DEFAULT_POST_SORT_DIRECTION;

  @IsOptional()
  @IsString()
  public search?: string;
}
