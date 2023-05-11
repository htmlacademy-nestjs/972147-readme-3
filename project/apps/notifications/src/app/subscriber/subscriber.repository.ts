import { CrudRepository } from '@project/util/util-types';
import { Subscriber } from '@project/shared/app-types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SubscriberModel } from './subscriber.model';
import { Model } from 'mongoose';
import { SubscriberDto } from './dto/subscriber.dto';

@Injectable()
export class SubscriberRepository implements CrudRepository<string, SubscriberDto, SubscriberDto, Subscriber> {
  constructor(@InjectModel(SubscriberModel.name) private readonly emailSubscriberModel: Model<SubscriberModel>) {}

  public async create(item: SubscriberDto): Promise<Subscriber> {
    const newEmailSubscriber = new this.emailSubscriberModel(item);
    await newEmailSubscriber.save();
    return newEmailSubscriber.toObject();
  }

  public async delete(id: string): Promise<void> {
    this.emailSubscriberModel.deleteOne({ _id: id });
  }

  public async get(id: string): Promise<Subscriber | null> {
    const subscriber = await this.emailSubscriberModel.findOne({ _id: id }).exec();
    if (!subscriber) {
      return null;
    }
    return subscriber.toObject();
  }

  public async update(id: string, item: SubscriberDto): Promise<Subscriber> {
    const subscriber = await this.emailSubscriberModel.findByIdAndUpdate({ id }, { ...item }, { new: true }).exec();
    if (!subscriber) {
      throw new Error('Not found');
    }

    return subscriber.toObject();
  }

  public async updateByUserId(item: SubscriberDto): Promise<Subscriber> {
    const subscriber = await this.emailSubscriberModel.findOneAndUpdate({ userId: item.userId }, { ...item }, { new: true }).exec();
    if (!subscriber) {
      throw new Error('Not found');
    }

    return subscriber.toObject();
  }

  public async findByUserId(userId: string): Promise<Subscriber | null> {
    const subscriber = await this.emailSubscriberModel.findOne({ userId }).exec();
    if (!subscriber) {
      return null;
    }
    return subscriber.toObject();
  }

  public async findSubscribersByUserId(userId: string): Promise<Subscriber[]> {
    const subscribers = await this.emailSubscriberModel.find({ userSubscriptions: { $in: [userId] } }).exec();
    return subscribers.map(subscriber => subscriber.toObject());
  }
}
