import { registerAs } from '@nestjs/config';
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { AppEnv } from "./app-env";

const DEFAULT_PORT = 3000;

export enum EnvironmentType {
  Development = 'development',
  Production = 'production',
  Stage = 'stage',
}

export interface ApplicationConfig {
  environment: EnvironmentType;
  port: number;
}

export default registerAs('application', (): ApplicationConfig => {
  const config: ApplicationConfig = {
    environment: process.env.NODE_ENV as EnvironmentType,
    port: parseInt(process.env.PORT || DEFAULT_PORT.toString(), 10),
  };

  const appEnv = plainToInstance(
    AppEnv,
    config,
    {enableImplicitConversion: true}
  );

  const errors = validateSync(
    appEnv, {
      skipMissingProperties: false
    }
  );

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return config;
});
