import { CrudRepository } from '@project/util/util-types';
import { Subscriber } from '@project/shared/app-types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EmailSubscriberModel } from './email-subscriber.model';
import { Model } from 'mongoose';
import { SubscriberDto } from './dto/subscriber.dto';

@Injectable()
export class EmailSubscriberRepository implements CrudRepository<string, SubscriberDto, SubscriberDto, Subscriber> {
  constructor(@InjectModel(EmailSubscriberModel.name) private readonly emailSubscriberModel: Model<EmailSubscriberModel>) {}

  public async create(item: SubscriberDto): Promise<Subscriber> {
    const newEmailSubscriber = new this.emailSubscriberModel(item);
    return newEmailSubscriber.save();
  }

  public async delete(id: string): Promise<void> {
    this.emailSubscriberModel.deleteOne({ _id: id });
  }

  public async get(id: string): Promise<Subscriber | null> {
    return this.emailSubscriberModel.findOne({ _id: id }).exec();
  }

  public async update(id: string, item: SubscriberDto): Promise<Subscriber> {
    const subscriber = await this.emailSubscriberModel.findByIdAndUpdate(id, { ...item }, { new: true }).exec();
    if (!subscriber) {
      throw new Error('Not found');
    }
    return subscriber;
  }

  public async findByEmail(email: string): Promise<Subscriber | null> {
    return this.emailSubscriberModel.findOne({ email }).exec();
  }
}
