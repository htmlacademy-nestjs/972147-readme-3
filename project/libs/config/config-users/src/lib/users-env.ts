import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { UsersConfig } from "./users.config";

const MIN_PORT = 0;
const MAX_PORT = 65535;

export class UsersEnv implements UsersConfig {
  @IsString()
  @IsNotEmpty()
  public host!: string;

  @IsString()
  @IsNotEmpty()
  public protocol!: string;

  @IsString()
  @IsNotEmpty()
  public profilePath!: string;

  @IsNumber()
  @Min(MIN_PORT)
  @Max(MAX_PORT)
  public port!: number;
}
