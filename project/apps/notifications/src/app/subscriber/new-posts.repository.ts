import { NewPost, Subscriber } from "@project/shared/app-types";
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewPostModel } from './new-post.model';

@Injectable()
export class NewPostsRepository {
  constructor(@InjectModel(NewPostModel.name) private readonly newPostModel: Model<NewPostModel>) {}

  public async createNewPosts(item: NewPost, subscribers: Subscriber[]): Promise<string[]> {
    const newPosts = await this.newPostModel.create(subscribers.map((subscriber) => ({ ...item, subscriberUserId: subscriber.userId })));
    return newPosts.map((p) => p.id);
  }

  public async getNewPosts(subscriber: Subscriber) {
    return this.newPostModel.find({ subscriberUserId: subscriber.userId }).exec();
  }

  public async deleteManyNewPosts(newPostIds: string[]) {
    await this.newPostModel.deleteMany({ _id: { $in: newPostIds }}).exec();
  }

  public async deleteNewPostsBySubscriber(subscriber: Subscriber): Promise<void> {
    await this.newPostModel.deleteMany( {subscriberUserId: subscriber.userId} ).exec();
  }

  public async deleteNewPostsByPostId(postId: string) {
    return this.newPostModel.deleteMany({ postId }).exec();
  }
}
