import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

const DEFAULT_POST_COUNT_LIMIT = 50;
const DEFAULT_POST_PAGE = 1;

export class BlogCommentQuery {
  @Transform(({ value } ) => +value || DEFAULT_POST_COUNT_LIMIT)
  @IsNumber()
  @IsOptional()
  public limit = DEFAULT_POST_COUNT_LIMIT;

  @Transform(({ value }) => +value || DEFAULT_POST_PAGE)
  @IsNumber()
  @IsOptional()
  public page: number = DEFAULT_POST_PAGE;

  @IsNotEmpty()
  @IsString()
  public postId!: string;
}
