import { Inject, Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { rabbitConfig } from '@project/config/config-rabbitmq';
import { ConfigType } from '@nestjs/config';
import { NewPost, Post, RabbitmqRoutingEnum } from '@project/shared/app-types';
import { appConfig } from '@project/config/config-app';

@Injectable()
export class NotifyService {
  constructor(
    private readonly rabbitClient: AmqpConnection,
    @Inject(rabbitConfig.KEY)
    private readonly rabbitOptions: ConfigType<typeof rabbitConfig>,
    @Inject(appConfig.KEY)
    private readonly appOptions: ConfigType<typeof appConfig>
  ) {}

  public async addNewPost(post: Post) {
    const newPost: NewPost = {
      postId: post.id,
      postTitle: post.type,
      authorId: post.authorId,
      postLink: `${this.appOptions.host}:${this.appOptions.port}/posts/${post.id}`,
    };
    return this.rabbitClient.publish<NewPost>(this.rabbitOptions.exchange, RabbitmqRoutingEnum.AddNewPost, newPost);
  }

  public async deleteNewPost(postId: string) {
    return this.rabbitClient.publish<string>(this.rabbitOptions.exchange, RabbitmqRoutingEnum.DeleteNewPost, postId);
  }
}
