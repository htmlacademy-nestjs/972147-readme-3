import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeletePostDto {
  @ApiProperty({
    description: 'Unique identifier author post',
    example: '644e7abb052df2e90a53b3c2',
  })
  @IsString()
  @IsNotEmpty()
  public authorId!: string;

  @ApiProperty({
    description: 'Unique identifier post',
    example: '5e1f5b9b-8c9b-4b9f-8c9b-4b9f5b9b8c9b',
  })
  @IsString()
  @IsNotEmpty()
  public postId!: string;
}
