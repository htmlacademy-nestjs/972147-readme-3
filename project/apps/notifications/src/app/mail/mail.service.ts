import { Subscriber } from '@project/shared/app-types';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailSubjectsEnum } from "./mail.subjects.enum";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendNotifyOnSubscribe(subscriber: Subscriber) {
    await this.mailerService.sendMail({
      to: subscriber.email,
      subject: MailSubjectsEnum.EMAIL_ADD_SUBSCRIBER,
      template: './add-subscriber',
      context: {
        user: `${subscriber.firstname} ${subscriber.lastname}`,
        email: `${subscriber.email}`,
      }
    })
  }

  public async sendNotifyOnUnsubscribe(subscriber: Subscriber) {
    await this.mailerService.sendMail({
      to: subscriber.email,
      subject: MailSubjectsEnum.EMAIL_REMOVE_SUBSCRIBER,
      template: './remove-subscriber',
      context: {
        user: `${subscriber.firstname} ${subscriber.lastname}`,
        email: `${subscriber.email}`,
      }
    })
  }
}
