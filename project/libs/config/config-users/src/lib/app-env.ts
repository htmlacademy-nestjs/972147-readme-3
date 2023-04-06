import { IsEnum, IsNumber, Max, Min } from 'class-validator';
import { ApplicationConfig, EnvironmentType } from "./app.config";

const MIN_PORT = 0;
const MAX_PORT = 65535;

enum EnvValidationMessage {
  AppEnvironmentRequired = 'Environment is not provided or invalid',
  AppPortRequired = 'App port is not provided our out of range',
}

export class AppEnv implements ApplicationConfig {
  @IsEnum(EnvironmentType,{
    message: EnvValidationMessage.AppEnvironmentRequired
  })
  public environment!: EnvironmentType;

  @IsNumber({}, {
    message: EnvValidationMessage.AppPortRequired
  })
  @Min(MIN_PORT)
  @Max(MAX_PORT)
  public port!: number;
}
