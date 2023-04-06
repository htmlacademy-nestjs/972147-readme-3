import { ApiProperty } from "@nestjs/swagger";

export class TextPostDto {
  @ApiProperty({
    description: 'Post name',
    example: 'Some post name'
  })
  public name!: string;

  @ApiProperty({
    description: 'Post name',
    example: 'Some post name'
  })
  public announceText!: string;

  @ApiProperty({
    description: 'Post name',
    example: 'Some post name'
  })
  public mainText!: string;
}
