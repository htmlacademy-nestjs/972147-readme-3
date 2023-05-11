import { Controller, Get, Inject, Req, UseFilters, UseGuards } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { bffConfig } from '@project/config/config-bff';
import { ConfigType } from '@nestjs/config';
import { AxiosExceptionFilter } from './filters/AxiosExceptionFilter';
import { CheckAuthGuard } from './guards/CheckAuthGuard';
import { ExtractUser } from '@project/shared/shared-decorators';
import { UserId } from './types/user-id';
import { Request } from 'express';
import { rabbitConfig } from '@project/config/config-rabbitmq';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { PostTypeEnum, RabbitmqRoutingEnum } from "@project/shared/app-types";
import { ApiExtraModels, ApiOkResponse, ApiQuery, ApiTags, getSchemaPath } from "@nestjs/swagger";
import { ImagePostRdo, LinkPostRdo, QuotePostRdo, TextPostRdo, VideoPostRdo } from "./rdo/posts";

const apiRdoModels = [LinkPostRdo, QuotePostRdo, TextPostRdo, ImagePostRdo, VideoPostRdo];

const anyOfRdoSchemaResponse = () => ({
  anyOf: apiRdoModels.map((model) => ({ $ref: getSchemaPath(model) })),
});

@ApiTags('Feed')
@ApiExtraModels(...apiRdoModels)
@Controller('feed')
@UseFilters(AxiosExceptionFilter)
export class FeedController {
  constructor(
    private readonly rabbitClient: AmqpConnection,
    private readonly httpService: HttpService,
    @Inject(bffConfig.KEY)
    private readonly bffOptions: ConfigType<typeof bffConfig>,
    @Inject(rabbitConfig.KEY)
    private readonly rabbitOptions: ConfigType<typeof rabbitConfig>
  ) {}

  private mkPostsUrl(path: string) {
    return `${this.bffOptions.postsUrl}/posts/${path}`;
  }

  private mkNotificationsUrl(path: string) {
    return `${this.bffOptions.notificationUrl}/${path}`;
  }

  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Limit of posts. Default is 25',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page of posts. Default is 1',
    example: 2,
  })
  @ApiQuery({
    name: 'type',
    enum: PostTypeEnum,
    required: false,
    description: 'Type of posts',
    example: PostTypeEnum.TEXT,
  })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    description: 'Sort by. Default is published',
    example: 'comments | likes | published',
  })
  @ApiQuery({
    name: 'sortDirection',
    type: String,
    required: false,
    description: 'Sort direction. Default is desc',
    example: 'desc | asc',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Search by title',
    example: 'title',
  })
  @ApiQuery({
    name: 'tags',
    type: String,
    required: false,
    description: 'Tags',
    isArray: true,
    example: 'love,meta,internet',
  })
  @ApiOkResponse({
    schema: anyOfRdoSchemaResponse(),
    description: 'List of posts',
    isArray: true,
  })
  @Get('')
  @UseGuards(CheckAuthGuard)
  public async getFeed(@ExtractUser() user: UserId, @Req() req: Request) {
    const { data: subscriptions } = await this.httpService.axiosRef.get(this.mkNotificationsUrl(`${user.userId}/subscriptions`));
    subscriptions.push(user.userId);
    const query = Object.entries(req.query).map(([key, value]) => `${key}=${value}`).join('&');
    const { data: postsData } = await this.httpService.axiosRef.get(this.mkPostsUrl(`?${query}&authorIds=${subscriptions.join(',')}`));

    return postsData;
  }

  @ApiOkResponse({
    description: 'New posts will be sent to email',
  })
  @Get('send-new-posts-to-email')
  @UseGuards(CheckAuthGuard)
  public async getNewPostsToEmail(@ExtractUser() user: UserId) {
    return this.rabbitClient.publish<string>(this.rabbitOptions.exchange, RabbitmqRoutingEnum.NotifyNewPosts, user.userId);
  }
}
