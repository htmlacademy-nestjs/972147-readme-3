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
  public firstname!: string;

  @Prop({ required: true })
  public lastname!: string;

  @Prop({ required: true })
  public passwordHash!: string;

  @Prop({ required: true })
  public email!: string;

  @Prop()
  public avatarFileId?: string;

  @Prop({ required: true })
  public registeredAt!: Date;
}

export const BlogUserSchema = SchemaFactory.createForClass(BlogUserModel);
