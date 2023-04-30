import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const getMailerOptions = (): MailerAsyncOptions => {
  return {
    useFactory: async (configService: ConfigService) => {
      return {
        transport: {
          host: configService.get(`mail.host`) as string,
          port: configService.get(`mail.port`) as number,
          secure: false,
          auth: {
            user: configService.get(`mail.user`) as string,
            pass: configService.get(`mail.password`) as string,
          },
        },
        defaults: {
          from: configService.get('mail.from') as string,
        },
        template: {
          dir: path.resolve(__dirname, 'assets'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      };
    },
    inject: [ConfigService],
  };
};
