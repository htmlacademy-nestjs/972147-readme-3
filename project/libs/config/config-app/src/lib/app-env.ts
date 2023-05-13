import { IsIn, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { ApplicationConfig } from './app.config';

enum Port {
  MIN = 0,
  MAX = 65535,
}

enum EnvValidationMessage {
  AppEnvironmentRequired = 'Environment is not provided or invalid',
  AppPortRequired = 'App port is not provided our out of range',
  AppHostRequired = 'App host is not provided',
  AppApiPrefixRequired = 'App API prefix is not provided',
  AppSpecPrefixRequired = 'App spec prefix is not provided',
}

export class AppEnv implements ApplicationConfig {
  @IsIn(['development', 'production', 'stage'], {
    message: EnvValidationMessage.AppEnvironmentRequired,
  })
  public environment!: 'development' | 'production' | 'stage';

  @IsString()
  @IsNotEmpty({ message: EnvValidationMessage.AppHostRequired })
  public host!: string;

  @IsNumber(
    {},
    {
      message: EnvValidationMessage.AppPortRequired,
    }
  )
  @Min(Port.MIN)
  @Max(Port.MAX)
  public port!: number;

  @IsString()
  @IsNotEmpty({ message: EnvValidationMessage.AppApiPrefixRequired })
  public apiPrefix!: string;

  @IsString()
  @IsNotEmpty({ message: EnvValidationMessage.AppSpecPrefixRequired })
  public specPrefix!: string;
}
