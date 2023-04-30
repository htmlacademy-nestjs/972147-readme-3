import { Module } from '@nestjs/common';
import { ConfigAppModule } from '@project/config/config-app';
import { ConfigRabbitmqModule } from '@project/config/config-rabbitmq';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigMongoModule, getMongoOptions } from '@project/config/config-mongo';
import { EmailSubscriberModule } from './email-subscriber/email-subscriber.module';
import { MailModule } from "./mail/mail.module";
import { ConfigMailModule } from "@project/config/config-mail";

@Module({
  imports: [ConfigAppModule, ConfigMailModule, ConfigRabbitmqModule, ConfigMongoModule, MailModule, MongooseModule.forRootAsync(getMongoOptions()), EmailSubscriberModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
