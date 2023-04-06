import { ApiProperty } from "@nestjs/swagger";

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
}
