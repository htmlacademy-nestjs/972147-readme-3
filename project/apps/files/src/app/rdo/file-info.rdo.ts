import { Expose } from "class-transformer";
import { FileInfo } from "@project/shared/app-types";
import { ApiProperty } from "@nestjs/swagger";

export class FileInfoRdo implements FileInfo {
  @Expose()
  @ApiProperty({
    description: 'Unique identifier of the file',
    example: '60f1c1c0e4b0b8b0c0b0b0b0'
  })
  public id!: string;

  @ApiProperty({
    description: 'Date when the file was uploaded',
    example: '2021-07-16T12:00:00.000Z'
  })
  @Expose()
  public uploadDate!: Date;

  @ApiProperty({
    description: 'Original name of the file',
    example: 'some-file-name.png'
  })
  @Expose()
  public filename!: string;

  @ApiProperty({
    description: 'Content type of the file',
    example: 'image/png'
  })
  @Expose()
  public contentType!: string;
}
