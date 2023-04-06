import { ApiProperty } from "@nestjs/swagger";

export class VideoPostDto {
  @ApiProperty({
    description: 'Video post name',
    example: 'Funny cat video'
  })
  public name!: string;

  @ApiProperty({
    description: 'Link to video',
    example: 'https://www.youtube.com/watch?v=QH2-TGUlwu4'
  })
  public link!: string;
}
