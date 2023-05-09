import { SubscriberDto } from './dto/subscriber.dto';
import { SubscriberRepository } from './subscriber.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { NewPost, Subscriber, UserSubscription } from '@project/shared/app-types';
import { NewPostsRepository } from './new-posts.repository';

@Injectable()
export class SubscriberService {
  constructor(private readonly subscriberRepository: SubscriberRepository, private readonly newPostsRepository: NewPostsRepository) {}

  public async getUserSubscriptions(userId: string): Promise<string[]> {
    const subscriber = await this.subscriberRepository.findByUserId(userId);

    if (!subscriber) {
      throw new NotFoundException();
    }

    return subscriber.userSubscriptions;
  }

  public async getUserSubscribers(userId: string): Promise<Subscriber[]> {
    const subscribers = await this.subscriberRepository.findSubscribersByUserId(userId);

    return [...subscribers];
  }

  public async addSubscriber(subscriber: SubscriberDto) {
    const { userId } = subscriber;
    const existsSubscriber = await this.subscriberRepository.findByUserId(userId);

    if (existsSubscriber) {
      return existsSubscriber;
    }

    return this.subscriberRepository.create(subscriber);
  }

  public async deleteSubscriber(userId: string) {
    const existsSubscriber = await this.subscriberRepository.findByUserId(userId);

    if (!existsSubscriber?.id) {
      return;
    }

    return this.subscriberRepository.delete(existsSubscriber.id);
  }

  public async getSubscriber(userId: string) {
    const existedSubscriber = await this.subscriberRepository.findByUserId(userId);

    if (!existedSubscriber) {
      throw new NotFoundException();
    }

    return existedSubscriber;
  }

  public async updateSubscriber(subscriber: SubscriberDto) {
    const { userId } = subscriber;
    const existsSubscriber = await this.subscriberRepository.findByUserId(userId);

    if (!existsSubscriber?.id) {
      throw new NotFoundException();
    }

    return this.subscriberRepository.update(existsSubscriber.id, { ...subscriber, userSubscriptions: existsSubscriber.userSubscriptions });
  }

  public async addSubscription(subscription: UserSubscription) {
    const subscriber = await this.subscriberRepository.findByUserId(subscription.fromUserId);

    if (!subscriber) {
      throw new NotFoundException();
    }

    if (subscriber.userSubscriptions.includes(subscription.toUserId)) {
      return;
    }

    return await this.subscriberRepository.updateByUserId({
      ...subscriber,
      userSubscriptions: [...subscriber.userSubscriptions, subscription.toUserId],
    });
  }

  public async deleteSubscription(subscription: UserSubscription) {
    const subscriber = await this.subscriberRepository.findByUserId(subscription.fromUserId);

    if (!subscriber) {
      throw new NotFoundException();
    }

    if (!subscriber.userSubscriptions.includes(subscription.toUserId)) {
      return;
    }

    return await this.subscriberRepository.updateByUserId({
      ...subscriber,
      userSubscriptions: subscriber.userSubscriptions.filter((id) => id !== subscription.toUserId),
    });
  }

  public async getNewPosts(subscriber: Subscriber) {
    return this.newPostsRepository.getNewPosts(subscriber);
  }

  public async addNewPost(newPost: NewPost) {
    const subscribers = await this.subscriberRepository.findSubscribersByUserId(newPost.authorId);
    return this.newPostsRepository.createNewPosts(newPost, subscribers);
  }

  public async deleteManyNewPosts(newPostIds: string[]) {
    return this.newPostsRepository.deleteManyNewPosts(newPostIds);
  }

  public async deleteNewPost(postId: string) {
    return this.newPostsRepository.deleteNewPostsByPostId(postId);
  }

  public async deleteNewPostsBySubscriber(subscriber: Subscriber): Promise<void> {
    return this.newPostsRepository.deleteNewPostsBySubscriber(subscriber);
  }
}
