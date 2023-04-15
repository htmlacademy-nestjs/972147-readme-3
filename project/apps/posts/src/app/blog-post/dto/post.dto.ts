import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class PostDto {
  @ApiProperty({
    description: 'Post publication date',
    example: '2020-01-01T00:00:00.000Z'
  })
  @Expose()
  public publishedAt?: Date;
}
