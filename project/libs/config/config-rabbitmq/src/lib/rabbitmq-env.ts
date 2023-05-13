import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { RabbitmqConfig } from "./rabbitmq.config";

enum Port {
  MIN = 0,
  MAX = 65535,
}

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
  @Min(Port.MIN)
  @Max(Port.MAX)
  public port!: number;

  @IsNotEmpty()
  @IsString()
  public queue!: string;

  @IsNotEmpty()
  @IsString()
  public exchange!: string;
}


