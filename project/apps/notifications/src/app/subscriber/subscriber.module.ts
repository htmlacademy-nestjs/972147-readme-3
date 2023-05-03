import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriberModel, EmailSubscriberSchema } from './subscriber.model';
import { SubscriberRepository } from './subscriber.repository';
import { SubscriberService } from './subscriber.service';
import { SubscriberController } from './subscriber.controller';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { getRabbitMQOptions } from '@project/config/config-rabbitmq';
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SubscriberModel.name, schema: EmailSubscriberSchema }]),
    RabbitMQModule.forRootAsync(RabbitMQModule, getRabbitMQOptions()),
    MailModule,
  ],
  controllers: [SubscriberController],
  providers: [SubscriberService, SubscriberRepository],
})
export class SubscriberModule {}
