import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { RedisEnv } from './redis-env';

export interface RedisConfig {
  host: string;
  password: string;
  port: number;
}

export default registerAs('redis', (): RedisConfig => {
  const config: RedisConfig = {
    host: process.env.REDIS_HOST || '',
    password: process.env.REDIS_PASSWORD || '',
    port: parseInt(process.env.REDIS_PORT || '', 10),
  };

  const appEnv = plainToInstance(RedisEnv, config, { enableImplicitConversion: true });

  const errors = validateSync(appEnv, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return config;
});
