import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { RabbitmqConfig } from "./rabbitmq.config";

const MIN_PORT = 0;
const MAX_PORT = 65535;

export class RabbitmqEnv implements RabbitmqConfig {
  @IsNotEmpty()
  @IsString()
  public host!: string;

  @IsNotEmpty()
  @IsString()
  public user!: string;

  @IsNotEmpty()
  @IsString()
  public password!: string;

  @IsNumber()
  @Min(MIN_PORT)
  @Max(MAX_PORT)
  public port!: number;

  @IsNotEmpty()
  @IsString()
  public queue!: string;

  @IsNotEmpty()
  @IsString()
  public exchange!: string;
}


