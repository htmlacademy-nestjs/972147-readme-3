import { SubscriberDto } from './dto/subscriber.dto';
import { EmailSubscriberService } from './email-subscriber.service';
import { Controller } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RabbitmqRoutingEnum } from '@project/shared/app-types';
import { MailService } from "../mail/mail.service";

@Controller()
export class EmailSubscriberController {
  constructor(
    private readonly subscriberService: EmailSubscriberService,
    private readonly mailService: MailService,
  ) {}

  @RabbitSubscribe({
    routingKey: RabbitmqRoutingEnum.AddSubscriber,
    exchange: 'notifications',
  })
  public async create(subscriber: SubscriberDto) {
    await this.subscriberService.addSubscriber(subscriber);
    await this.mailService.sendNotifyNewSubscriber(subscriber);
  }

  @RabbitSubscribe({
    routingKey: RabbitmqRoutingEnum.DeleteSubscriber,
    exchange: 'notifications'
  })
  public async delete(subscriber: SubscriberDto) {
    await this.subscriberService.deleteSubscriber(subscriber.email);
    await this.mailService.sendNotifyOnUnsubscribe(subscriber);
  }
}
