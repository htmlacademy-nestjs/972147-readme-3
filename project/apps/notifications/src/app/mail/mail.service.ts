import { NewPost, Subscriber } from '@project/shared/app-types';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailSubjectsEnum } from './mail.subjects.enum';

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
      },
    });
  }

  public async sendNotifyOnUnsubscribe(subscriber: Subscriber) {
    await this.mailerService.sendMail({
      to: subscriber.email,
      subject: MailSubjectsEnum.EMAIL_REMOVE_SUBSCRIBER,
      template: './remove-subscriber',
      context: {
        user: `${subscriber.firstname} ${subscriber.lastname}`,
        email: `${subscriber.email}`,
      },
    });
  }

  public async sendNotifyOnNewPosts(subscriber: Subscriber, newPosts: NewPost[]) {
    await this.mailerService.sendMail({
      to: subscriber.email,
      subject: MailSubjectsEnum.EMAIL_NEW_POSTS,
      template: './new-posts',
      context: {
        user: `${subscriber.firstname} ${subscriber.lastname}`,
        posts: newPosts.map((post) => ({ link: post.postLink, title: post.postTitle })),
      },
    });
  }
}
