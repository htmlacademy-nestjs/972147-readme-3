import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { RedisConfig } from "./redis.config";

const MIN_PORT = 0;
const MAX_PORT = 65535;

export class RedisEnv implements RedisConfig {
  @IsNotEmpty()
  @IsString()
  public host!: string;

  @IsNotEmpty()
  @IsString()
  public password!: string;

  @IsNumber()
  @Min(MIN_PORT)
  @Max(MAX_PORT)
  public port!: number;
}
