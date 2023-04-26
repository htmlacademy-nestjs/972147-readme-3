import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { JwtEnv } from './jwt-env';

export interface JwtConfig {
  accessTokenSecret: string;
  accessTokenExpiresIn: string;
}

export default registerAs('jwt', (): JwtConfig => {
  const config: JwtConfig = {
    accessTokenSecret: process.env.JWT_AT_SECRET || '',
    accessTokenExpiresIn: process.env.JWT_AT_EXPIRES_IN || ''
  };

  const appEnv = plainToInstance(JwtEnv, config, { enableImplicitConversion: true });

  const errors = validateSync(appEnv, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return config;
});
