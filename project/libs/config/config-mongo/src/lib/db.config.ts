import { registerAs } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { DbEnv } from "./db-env";
import { plainToInstance } from "class-transformer";

export interface DbConfig {
  host: string;
  name: string;
  port: number;
  user: string;
  password: string;
  authBase: string;
}

export default registerAs('db', (): DbConfig => {
  const config: DbConfig = {
    host: process.env.MONGO_HOST || '',
    port: parseInt(process.env.MONGO_PORT || '', 10),
    name: process.env.MONGO_DB || '',
    user: process.env.MONGO_USER || '',
    password: process.env.MONGO_PASSWORD || '',
    authBase: process.env.MONGO_AUTH_BASE || '',
  };

  const dbEnv = plainToInstance(
    DbEnv,
    config,
    {enableImplicitConversion: true}
  );

  const errors = validateSync(
    dbEnv, {
      skipMissingProperties: false
    }
  );

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return config;
});
