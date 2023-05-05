import { registerAs } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { RabbitmqEnv } from "./rabbitmq-env";
import { plainToInstance } from "class-transformer";

export interface RabbitmqConfig {
  host: string;
  user: string;
  password: string;
  queue: string;
  exchange: string;
  port: number;
}

export default registerAs('rabbitmq', (): RabbitmqConfig => {
  const config: RabbitmqConfig = {
    host: process.env.RABBITMQ_HOST || '',
    user: process.env.RABBITMQ_USER || '',
    password: process.env.RABBITMQ_PASSWORD || '',
    queue: process.env.RABBITMQ_QUEUE || '',
    exchange: process.env.RABBITMQ_EXCHANGE || '',
    port: parseInt(process.env.RABBITMQ_PORT || '', 10),
  };

  const dbEnv = plainToInstance(
    RabbitmqEnv,
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
