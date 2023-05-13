import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AppEnv } from './app-env';

export interface ApplicationConfig {
  host: string;
  environment: 'development' | 'production' | 'stage';
  port: number;
  apiPrefix: string;
  specPrefix: string;
}

export default registerAs('application', (): ApplicationConfig => {
  const config: ApplicationConfig = {
    host: process.env.HOST || 'localhost',
    apiPrefix: process.env.API_PREFIX || 'api',
    specPrefix: process.env.SPEC_PREFIX || 'spec',
    environment: process.env.NODE_ENV as ApplicationConfig['environment'],
    port: parseInt(process.env.PORT || '', 10),
  };

  const appEnv = plainToInstance(AppEnv, config, { enableImplicitConversion: true });

  const errors = validateSync(appEnv, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return config;
});
