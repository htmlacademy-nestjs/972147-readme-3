import { Inject, Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { rabbitConfig } from '@project/config/config-rabbitmq';
import { ConfigType } from '@nestjs/config';
import { SubscriberDto } from './dto/subscriber.dto';
import { RabbitmqRoutingEnum, UserSubscription } from '@project/shared/app-types';

@Injectable()
export class NotifyService {
  constructor(
    private readonly rabbitClient: AmqpConnection,
    @Inject(rabbitConfig.KEY)
    private readonly rabbitOptions: ConfigType<typeof rabbitConfig>
  ) {}

  public async registerSubscriber(dto: SubscriberDto) {
    return this.rabbitClient.publish<SubscriberDto>(this.rabbitOptions.exchange, RabbitmqRoutingEnum.AddSubscriber, { ...dto });
  }

  public async unregisterSubscriber(userId: string) {
    return this.rabbitClient.publish<string>(this.rabbitOptions.exchange, RabbitmqRoutingEnum.DeleteSubscriber, userId);
  }

  public async subscribeToUser(subscription: UserSubscription) {
    return this.rabbitClient.publish<UserSubscription>(this.rabbitOptions.exchange, RabbitmqRoutingEnum.AddSubscription, { ...subscription });
  }

  public async unsubscribeFromUser(subscription: UserSubscription) {
    return this.rabbitClient.publish<UserSubscription>(this.rabbitOptions.exchange, RabbitmqRoutingEnum.DeleteSubscription, { ...subscription });
  }
}
