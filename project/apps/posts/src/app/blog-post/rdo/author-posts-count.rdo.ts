import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class AuthorPostsCountRdo {
  @ApiProperty({
    description: 'Number of posts',
    example: 12
  })
  @Expose()
  public count!: number;
}
