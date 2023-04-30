import { SubscriberDto } from './dto/subscriber.dto';
import { EmailSubscriberRepository } from './email-subscriber.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailSubscriberService {
  constructor(private readonly emailSubscriberRepository: EmailSubscriberRepository) {}

  public async addSubscriber(subscriber: SubscriberDto) {
    const { email } = subscriber;
    const existsSubscriber = await this.emailSubscriberRepository.findByEmail(email);

    if (existsSubscriber) {
      return existsSubscriber;
    }

    return this.emailSubscriberRepository.create(subscriber);
  }

  public async deleteSubscriber(email: string) {
    const existsSubscriber = await this.emailSubscriberRepository.findByEmail(email);

    if (!existsSubscriber?.id) {
      return;
    }

    return this.emailSubscriberRepository.delete(existsSubscriber.id);
  }
}
