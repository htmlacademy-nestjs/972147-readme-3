import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CheckUserRdo {
  @ApiProperty({
    description: 'User unique ID',
    example: '5f9c1b9b9c9d1b1b8c8c8c8c',
  })
  @Expose()
  public userId!: string;
}
