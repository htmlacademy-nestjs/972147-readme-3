import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { BffEnv } from './bff-env';

export interface BffConfig {
  usersUrl: string;
  postsUrl: string;
  filesUrl: string;
  notificationUrl: string;
  httpClientMaxRedirects: number;
  httpClientTimeoutMs: number;
}

export default registerAs('bff', (): BffConfig => {
  const config: BffConfig = {
    httpClientMaxRedirects: Number(process.env.HTTP_CLIENT_MAX_REDIRECTS) || 5,
    httpClientTimeoutMs: Number(process.env.HTTP_CLIENT_TIMEOUT_MS) || 5000,
    usersUrl: process.env.USERS_URL || '',
    postsUrl: process.env.POSTS_URL || '',
    filesUrl: process.env.FILES_URL || '',
    notificationUrl: process.env.NOTIFICATIONS_URL || '',
  };

  const appEnv = plainToInstance(BffEnv, config, { enableImplicitConversion: true });

  const errors = validateSync(appEnv, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return config;
});
