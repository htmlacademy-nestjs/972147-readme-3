import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { MailConfig } from "./mail.config";

enum Port {
  MIN = 0,
  MAX = 65535,
}

export class MailEnv implements MailConfig {
  @IsNotEmpty()
  @IsString()
  public host!: string;

  @IsNumber()
  @Min(Port.MIN)
  @Max(Port.MAX)
  public port!: number;

  @IsNotEmpty()
  @IsString()
  public user!: string;

  @IsNotEmpty()
  @IsString()
  public password!: string;

  @IsNotEmpty()
  @IsString()
  public from!: string;
}


