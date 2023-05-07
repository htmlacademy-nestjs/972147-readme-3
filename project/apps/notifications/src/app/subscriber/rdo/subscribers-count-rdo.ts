import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class SubscribersCountRdo {
  @ApiProperty({
    description: 'Number of subscribers',
    example: 12
  })
  @Expose()
  public count!: number;
}
