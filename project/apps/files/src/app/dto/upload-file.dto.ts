import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from "class-validator";

export class UploadFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: unknown;

  @ApiProperty({
    description: 'Unique identifier owner file',
    example: '644e7abb052df2e90a53b3c2',
  })
  @IsString()
  @IsNotEmpty()
  public ownerId!: string;
}
