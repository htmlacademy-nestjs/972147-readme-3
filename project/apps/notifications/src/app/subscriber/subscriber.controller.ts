import { SubscriberDto } from './dto/subscriber.dto';
import { SubscriberService } from './subscriber.service';
import { Controller, Get } from "@nestjs/common";
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RabbitmqRoutingEnum, Subscriber, UserSubscription } from "@project/shared/app-types";
import { MailService } from "../mail/mail.service";
import { ApiNotFoundResponse, ApiOkResponse } from "@nestjs/swagger";

@Controller('subscriber')
export class SubscriberController {
  constructor(
    private readonly subscriberService: SubscriberService,
    private readonly mailService: MailService,
  ) {}

  @ApiOkResponse({
    type: String,
    isArray: true,
    description: 'Get subscriptions by user id',
  })
  @ApiNotFoundResponse({
    description: 'User not found'
  })
  @Get(':userId/subscriptions')
  public async getSubscriptions(userId: string) {
    return this.subscriberService.getUserSubscriptions(userId);
  }

  @ApiOkResponse({
    type: Subscriber,
    isArray: true,
    description: 'Get subscribers by user id',
  })
  @Get(':userId/subscribers')
  public async getSubscribers(userId: string) {
    return this.subscriberService.getUserSubscribers(userId);
  }

  @ApiOkResponse({
    type: Number,
    description: 'Get count user subscribers',
  })
  @Get(':userId/count-subscribers')
  public async getCountSubscribers(userId: string) {
    const subscribers = await this.subscriberService.getUserSubscribers(userId);
    return subscribers.length;
  }

  @RabbitSubscribe({
    routingKey: RabbitmqRoutingEnum.AddSubscriber,
    exchange: 'notifications',
  })
  public async createSubscriber(subscriber: SubscriberDto) {
    await this.subscriberService.addSubscriber(subscriber);
    await this.mailService.sendNotifyOnSubscribe(subscriber);
  }

  @RabbitSubscribe({
    routingKey: RabbitmqRoutingEnum.UpdateSubscriber,
    exchange: 'notifications'
  })
  public async updateSubscriber(subscriber: SubscriberDto) {
    await this.subscriberService.updateSubscriber(subscriber);
  }

  @RabbitSubscribe({
    routingKey: RabbitmqRoutingEnum.DeleteSubscriber,
    exchange: 'notifications'
  })
  public async deleteSubscriber(userId: string) {
    const subscriber = await this.subscriberService.getSubscriber(userId);
    await this.subscriberService.deleteSubscriber(subscriber.userId);
    await this.mailService.sendNotifyOnUnsubscribe(subscriber);
  }

  @RabbitSubscribe({
    routingKey: RabbitmqRoutingEnum.AddSubscription,
    exchange: 'notifications'
  })
  public async addSubscription(subscription: UserSubscription) {
    await this.subscriberService.addSubscription(subscription);
  }

  @RabbitSubscribe({
    routingKey: RabbitmqRoutingEnum.DeleteSubscription,
    exchange: 'notifications'
  })
  public async deleteSubscription(subscription: UserSubscription) {
    await this.subscriberService.deleteSubscription(subscription);
  }
}
