import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@project/shared/app-types';

@Schema({
  collection: 'users',
  timestamps: true,
})
export class BlogUserModel extends Document implements User {
  public id!: string;

  @Prop({ required: true })
  public firstName!: string;

  @Prop({ required: true })
  public lastName!: string;

  @Prop({ required: true })
  public passwordHash!: string;

  @Prop({ required: true })
  public email!: string;

  @Prop()
  public avatar?: string;

  @Prop({ required: true })
  public registeredAt!: Date;

  @Prop({ required: true })
  public postsCount!: number;

  @Prop({ required: true })
  public subscribersCount!: number;

}

export const BlogUserSchema = SchemaFactory.createForClass(BlogUserModel);
