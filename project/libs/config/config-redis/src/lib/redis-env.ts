import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { RedisConfig } from "./redis.config";

enum Port {
  MIN = 0,
  MAX = 65535,
}

export class RedisEnv implements RedisConfig {
  @IsNotEmpty()
  @IsString()
  public host!: string;

  @IsNotEmpty()
  @IsString()
  public password!: string;

  @IsNumber()
  @Min(Port.MIN)
  @Max(Port.MAX)
  public port!: number;
}
