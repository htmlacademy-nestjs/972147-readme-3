import { Module } from '@nestjs/common';
import { getMailerOptions } from '@project/config/config-mail';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
  imports: [MailerModule.forRootAsync(getMailerOptions())],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
