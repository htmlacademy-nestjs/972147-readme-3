import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { BlogCommentsService } from './blog-comments.service';
import { fillObject } from '@project/util/util-core';
import { CommentRdo } from './rdo/comment.rdo';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { BlogCommentQuery } from './query/blog-comment.query';
import { DeleteCommentDto } from "./dto/delete-comment.dto";

@ApiTags('Comments')
@Controller('comments')
export class BlogCommentController {
  constructor(private readonly service: BlogCommentsService) {}

  @ApiOkResponse({
    type: CommentRdo,
    description: 'Comment has been successfully retrieved.',
  })
  @ApiNotFoundResponse({
    description: 'Comment not found',
  })
  @Get(':id')
  public async getComment(@Param('id', ParseUUIDPipe) id: string): Promise<CommentRdo> {
    const comment = await this.service.getComment(id);
    return fillObject(CommentRdo, comment);
  }

  @ApiBody({
    type: CreateCommentDto,
    description: 'Comment data',
  })
  @ApiCreatedResponse({
    type: CommentRdo,
    description: 'Comment has been successfully created.',
  })
  @ApiNotFoundResponse({
    description: 'Post not found',
  })
  @Post('')
  public async createComment(@Body() dto: CreateCommentDto) {
    const comment = await this.service.createComment(dto);
    return fillObject(CommentRdo, comment);
  }

  @ApiBody({
    type: DeleteCommentDto,
    description: 'Delete comment data',
  })
  @ApiBadRequestResponse({
    description: 'Author id and comment id are not match'
  })
  @ApiNotFoundResponse({
    description: 'Comment not found',
  })
  @ApiOkResponse({
    description: 'Comment has been successfully deleted.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('delete')
  public async deleteComment(@Body() dto: DeleteCommentDto) {
    await this.service.deleteComment(dto);
  }

  @ApiBody({
    type: UpdateCommentDto,
    description: 'Comment data',
  })
  @ApiNotFoundResponse({
    description: 'Comment not found',
  })
  @ApiOkResponse({
    type: CommentRdo,
    description: 'Comment has been successfully updated.',
  })
  @Post(':id')
  public async updateComment(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCommentDto) {
    const comment = await this.service.updateComment(id, dto);
    return fillObject(CommentRdo, comment);
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
  @ApiQuery({
    name: 'postId',
    required: true,
    type: String,
    description: 'Post id',
  })
  @ApiOkResponse({
    type: CommentRdo,
    description: 'Comments has been successfully retrieved.',
    isArray: true,
  })
  @Get('')
  public async getCommentsList(@Query() query: BlogCommentQuery): Promise<CommentRdo[]> {
    const comments = await this.service.getCommentsList(query);
    return comments.map((comment) => fillObject(CommentRdo, comment));
  }
}
