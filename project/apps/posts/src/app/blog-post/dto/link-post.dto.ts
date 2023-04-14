import { ApiProperty } from "@nestjs/swagger";
import { PostTypeEnum } from "@project/shared/app-types";
import { Expose } from "class-transformer";

export class LinkPostDto {
  @ApiProperty({
    description: 'Link to be shared as post',
    example: 'https://www.google.com'
  })
  public link!: string;

  @ApiProperty({
    description: 'Description to link',
    example: 'Google search'
  })
  public description?: string;

  @ApiProperty({
    description: 'Type of the post',
    example: PostTypeEnum.LINK,
  })
  @Expose()
  public type: PostTypeEnum.LINK = PostTypeEnum.LINK;
}
