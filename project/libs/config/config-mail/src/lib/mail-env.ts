import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { MailConfig } from "./mail.config";

const MIN_PORT = 0;
const MAX_PORT = 65535;

export class MailEnv implements MailConfig {
  @IsNotEmpty()
  @IsString()
  public host!: string;

  @IsNumber()
  @Min(MIN_PORT)
  @Max(MAX_PORT)
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


