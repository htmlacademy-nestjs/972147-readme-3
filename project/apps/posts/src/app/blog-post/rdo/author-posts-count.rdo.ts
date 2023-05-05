import { Expose } from "class-transformer";
import { PostRdo } from "./post.rdo";
import { ApiProperty } from "@nestjs/swagger";

export class AuthorPostsCountRdo extends PostRdo {
  @ApiProperty({
    description: 'Number of posts',
    example: 12
  })
  @Expose()
  public countPosts!: number;
}
