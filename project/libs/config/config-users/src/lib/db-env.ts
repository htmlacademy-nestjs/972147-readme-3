import { IsNumber, IsString, Max, Min } from 'class-validator';
import { DbConfig } from "./db.config";

const MIN_PORT = 0;
const MAX_PORT = 65535;

enum EnvValidationMessage {
  DBHostRequired = 'MongoDB host is required',
  DBNameRequired = 'Database name is required',
  DBPortRequired = 'MongoDB port is required',
  DBUserRequired = 'MongoDB user is required',
  DBPasswordRequired = 'MongoDB password is required',
  DBBaseAuthRequired = 'MongoDB authentication base is required',
}

export class DbEnv implements DbConfig {
  @IsString({
    message: EnvValidationMessage.DBNameRequired
  })
  public name!: string;

  @IsString({
    message: EnvValidationMessage.DBHostRequired
  })
  public host!: string;

  @IsNumber({}, {
    message: EnvValidationMessage.DBPortRequired
  })
  @Min(MIN_PORT)
  @Max(MAX_PORT)
  public port!: number;

  @IsString({
    message: EnvValidationMessage.DBUserRequired
  })
  public user!: string;

  @IsString({
    message: EnvValidationMessage.DBPasswordRequired
  })
  public password!: string;

  @IsString({
    message: EnvValidationMessage.DBBaseAuthRequired
  })
  public authBase!: string;
}
