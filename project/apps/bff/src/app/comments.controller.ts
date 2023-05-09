import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Req, UseFilters, UseGuards } from "@nestjs/common";
import { Request } from 'express';
import { CheckAuthGuard } from './guards/CheckAuthGuard';
import { ExtractUser } from '@project/shared/shared-decorators';
import { UserId } from './types/user-id';
import { CommentDto } from './dto/posts/comment.dto';
import { AxiosExceptionFilter } from './filters/AxiosExceptionFilter';
import { HttpService } from '@nestjs/axios';
import { bffConfig } from '@project/config/config-bff';
import { ConfigType } from '@nestjs/config';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CommentRdo } from './rdo/posts/comment.rdo';

@ApiTags('Comments')
@Controller('comments')
@UseFilters(AxiosExceptionFilter)
export class CommentsController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(bffConfig.KEY)
    private readonly bffOptions: ConfigType<typeof bffConfig>
  ) {}

  private mkCommentsUrl(path: string) {
    return `${this.bffOptions.postsUrl}/comments/${path}`;
  }

  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit of comments. Default is 50',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page of comments. Default is 1',
  })
  @ApiOkResponse({
    type: CommentRdo,
    description: 'Comments has been successfully retrieved.',
    isArray: true,
  })
  @Get('list/:postId')
  public async getComments(@Req() req: Request, @Param('postId') postId: string) {
    const query = Object.entries(req.query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    const { data: commentsData } = await this.httpService.axiosRef.get(this.mkCommentsUrl(`?${query}&postId=${postId}`));

    return commentsData;
  }

  @ApiCreatedResponse({
    type: CommentRdo,
    description: 'Comment has been successfully updated.',
  })
  @ApiBody({
    type: CommentDto,
    description: 'Comment data',
  })
  @ApiNotFoundResponse({
    description: 'Comment not found',
  })
  @HttpCode(HttpStatus.OK)
  @Post('update/:commentId')
  @UseGuards(CheckAuthGuard)
  public async updateComment(@ExtractUser() user: UserId, @Param('commentId') commentId: string, @Body() dto: CommentDto) {
    const { data: commentData } = await this.httpService.axiosRef.post(this.mkCommentsUrl(`${commentId}`), { authorId: user.userId, text: dto.text });

    return commentData;
  }

  @ApiCreatedResponse({
    type: CommentRdo,
    description: 'Comment has been successfully created.',
  })
  @ApiBody({
    type: CommentDto,
    description: 'Comment data',
  })
  @ApiNotFoundResponse({
    description: 'Post not found',
  })
  @Post(':postId')
  @UseGuards(CheckAuthGuard)
  public async createComment(@ExtractUser() user: UserId, @Param('postId') postId: string, @Body() dto: CommentDto) {
    const { data: commentData } = await this.httpService.axiosRef.post(this.mkCommentsUrl(''), { postId, authorId: user.userId, text: dto.text });

    return commentData;
  }

  @ApiBadRequestResponse({
    description: 'Author id and comment id are not match'
  })
  @ApiNotFoundResponse({
    description: 'Comment not found',
  })
  @ApiOkResponse({
    description: 'Comment has been successfully deleted.',
  })
  @Delete(':commentId')
  @UseGuards(CheckAuthGuard)
  public async deleteComment(@ExtractUser() user: UserId, @Param('commentId') commentId: string) {
    const { data: commentData } = await this.httpService.axiosRef.post(this.mkCommentsUrl('delete'), { commentId, authorId: user.userId });

    return commentData;
  }
}
