import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { UsersEnv } from './users-env';

export interface UsersConfig {
  protocol: string;
  host: string;
  port: number;
  profilePath: string;
}

export default registerAs('users', (): UsersConfig => {
  const config: UsersConfig = {
    host: process.env.USERS_HOST || '',
    protocol: process.env.USERS_PROTOCOL || '',
    profilePath: process.env.USERS_PROFILE_PATH || '',
    port: parseInt(process.env.USERS_PORT || '', 10),
  };

  const appEnv = plainToInstance(UsersEnv, config, { enableImplicitConversion: true });

  const errors = validateSync(appEnv, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return config;
});
