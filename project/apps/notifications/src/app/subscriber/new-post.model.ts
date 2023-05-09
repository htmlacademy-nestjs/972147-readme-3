import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NewPost } from "@project/shared/app-types";

@Schema({
  collection: 'new-posts',
  timestamps: true,
})
export class NewPostModel extends Document implements NewPost {
  public id!: string;

  @Prop({ required: true })
  public subscriberUserId!: string;

  @Prop({ required: true })
  public authorId!: string;

  @Prop({ required: true })
  public postId!: string;

  @Prop({ required: true })
  public postLink!: string;

  @Prop({ required: true })
  public postTitle!: string;
}

export const NewPostSchema = SchemaFactory.createForClass(NewPostModel);
