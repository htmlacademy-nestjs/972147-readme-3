import { SubscriberDto } from './dto/subscriber.dto';
import { SubscriberService } from './subscriber.service';
import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { NewPost, RabbitmqRoutingEnum, Subscriber, UserSubscription } from '@project/shared/app-types';
import { MailService } from '../mail/mail.service';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { fillObject } from "@project/util/util-core";
import { SubscribersCountRdo } from "./rdo/subscribers-count-rdo";

@Controller()
export class SubscriberController {
  constructor(private readonly subscriberService: SubscriberService, private readonly mailService: MailService) {}

  @ApiOkResponse({
    type: String,
    isArray: true,
    description: 'User subscriptions - Ids of users',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Get(':userId/subscriptions')
  public async getSubscriptions(@Param('userId') userId: string) {
    return this.subscriberService.getUserSubscriptions(userId);
  }

  @ApiOkResponse({
    type: Subscriber,
    isArray: true,
    description: 'User subscribers',
  })
  @Get(':userId/subscribers')
  public async getSubscribers(@Param('userId') userId: string) {
    return this.subscriberService.getUserSubscribers(userId);
  }

  @ApiOkResponse({
    type: Number,
    description: 'Count of user subscribers',
  })
  @Get(':userId/count-subscribers')
  public async getCountSubscribers(@Param('userId') userId: string) {
    const subscribers = await this.subscriberService.getUserSubscribers(userId);
    return fillObject(SubscribersCountRdo, { count: subscribers.length });
  }

  @RabbitSubscribe({
    routingKey: RabbitmqRoutingEnum.AddSubscriber,
    exchange: 'notifications',
  })
  public async createSubscriber(subscriber: SubscriberDto) {
    await this.subscriberService.addSubscriber(subscriber);
    await this.mailService.sendNotifyOnSubscribe(subscriber);
    return;
  }

  @RabbitSubscribe({
    routingKey: RabbitmqRoutingEnum.UpdateSubscriber,
    exchange: 'notifications',
  })
  public async updateSubscriber(subscriber: SubscriberDto) {
    await this.subscriberService.updateSubscriber(subscriber);
    return;
  }

  @RabbitSubscribe({
    routingKey: RabbitmqRoutingEnum.DeleteSubscriber,
    exchange: 'notifications',
  })
  public async deleteSubscriber(userId: string) {
    const subscriber = await this.subscriberService.getSubscriber(userId);
    await this.subscriberService.deleteSubscriber(subscriber.userId);
    await this.mailService.sendNotifyOnUnsubscribe(subscriber);
    return;
  }

  @RabbitSubscribe({
    routingKey: RabbitmqRoutingEnum.AddSubscription,
    exchange: 'notifications',
  })
  public async addSubscription(subscription: UserSubscription) {
    await this.subscriberService.addSubscription(subscription);
    return;
  }

  @RabbitSubscribe({
    routingKey: RabbitmqRoutingEnum.DeleteSubscription,
    exchange: 'notifications',
  })
  public async deleteSubscription(subscription: UserSubscription) {
    await this.subscriberService.deleteSubscription(subscription);
    const subscriber = await this.subscriberService.getSubscriber(subscription.fromUserId);
    const newPosts = await this.subscriberService.getNewPosts(subscriber);
    await this.subscriberService.deleteManyNewPosts(newPosts.filter((post) => post.authorId === subscription.toUserId).map((p) => p.id));
    return;
  }

  @RabbitSubscribe({
    routingKey: RabbitmqRoutingEnum.AddNewPost,
    exchange: 'notifications',
  })
  public async addNewPost(post: NewPost) {
    await this.subscriberService.addNewPost(post);
    return;
  }

  @RabbitSubscribe({
    routingKey: RabbitmqRoutingEnum.DeleteNewPost,
    exchange: 'notifications',
  })
  public async deleteNewPost(postId: string) {
    await this.subscriberService.deleteNewPost(postId);
    return;
  }

  @RabbitSubscribe({
    routingKey: RabbitmqRoutingEnum.NotifyNewPosts,
    exchange: 'notifications',
  })
  public async notifyNewPosts(subscriberId: string) {
    const subscriber = await this.subscriberService.getSubscriber(subscriberId);
    if (!subscriber) {
      return new NotFoundException('Subscriber not found');
    }
    const newPosts = await this.subscriberService.getNewPosts(subscriber);
    if (newPosts.length === 0) {
      return ;
    }
    await this.mailService.sendNotifyOnNewPosts(subscriber, newPosts);
    await this.subscriberService.deleteNewPostsBySubscriber(subscriber);
    return;
  }
}
