import { registerAs } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { MailEnv } from "./mail-env";
import { plainToInstance } from "class-transformer";

export interface MailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

export default registerAs('mail', (): MailConfig => {
  const config: MailConfig = {
    host: process.env.MAIL_SMTP_HOST || '',
    port: parseInt(process.env.MAIL_SMTP_PORT || '', 10),
    user: process.env.MAIL_USER || '',
    password: process.env.MAIL_USER_PASSWORD || '',
    from: process.env.MAIL_FROM || '',
  };

  const dbEnv = plainToInstance(
    MailEnv,
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
