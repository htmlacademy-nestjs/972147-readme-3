import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Subscriber } from '@project/shared/app-types';

@Schema({
  collection: 'user-subscribes',
  timestamps: true,
})
export class SubscriberModel extends Document implements Subscriber {
  public id!: string;

  @Prop({ required: true, unique: true })
  public userId!: string;

  @Prop({ required: true, unique: true })
  public email!: string;

  @Prop({ required: true })
  public firstname!: string;

  @Prop({ required: true })
  public lastname!: string;

  @Prop({ required: true, type: [String] })
  public userSubscriptions!: string[];
}

export const EmailSubscriberSchema = SchemaFactory.createForClass(SubscriberModel);
