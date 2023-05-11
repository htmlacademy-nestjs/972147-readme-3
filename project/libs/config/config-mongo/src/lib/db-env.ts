import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { DbConfig } from "./db.config";

enum Port {
  MIN = 0,
  MAX = 65535,
}

enum EnvValidationMessage {
  DBHostRequired = 'MongoDB host is required',
  DBNameRequired = 'Database name is required',
  DBPortRequired = 'MongoDB port is required',
  DBUserRequired = 'MongoDB user is required',
  DBPasswordRequired = 'MongoDB password is required',
  DBBaseAuthRequired = 'MongoDB authentication base is required',
}

export class DbEnv implements DbConfig {
  @IsNotEmpty()
  @IsString({
    message: EnvValidationMessage.DBNameRequired
  })
  public name!: string;

  @IsNotEmpty()
  @IsString({
    message: EnvValidationMessage.DBHostRequired
  })
  public host!: string;

  @IsNumber({}, {
    message: EnvValidationMessage.DBPortRequired
  })
  @Min(Port.MIN)
  @Max(Port.MAX)
  public port!: number;

  @IsNotEmpty()
  @IsString({
    message: EnvValidationMessage.DBUserRequired
  })
  public user!: string;

  @IsNotEmpty()
  @IsString({
    message: EnvValidationMessage.DBPasswordRequired
  })
  public password!: string;

  @IsNotEmpty()
  @IsString({
    message: EnvValidationMessage.DBBaseAuthRequired
  })
  public authBase!: string;
}
