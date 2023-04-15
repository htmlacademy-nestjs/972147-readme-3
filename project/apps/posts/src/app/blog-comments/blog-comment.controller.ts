import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BlogCommentsService } from './blog-comments.service';
import { fillObject } from '@project/util/util-core';
import { CommentRdo } from './rdo/comment.rdo';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

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
  public async getComment(@Param('id') id: string): Promise<CommentRdo> {
    const comment = await this.service.getComment(id);
    return fillObject(CommentRdo, comment);
  }

  @ApiCreatedResponse({
    type: CommentRdo,
    description: 'Comment has been successfully created.',
  })
  @Post('create')
  public async createComment(@Body() dto: CreateCommentDto) {
    const comment = await this.service.createComment(dto);
    return fillObject(CommentRdo, comment);
  }

  @ApiOkResponse({
    type: CommentRdo,
    description: 'Comment has been successfully updated.',
  })
  @Post(':id/update')
  public async updateComment(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    const comment = await this.service.updateComment(id, dto);
    return fillObject(CommentRdo, comment);
  }

  @ApiNotFoundResponse({
    description: 'Comment not found',
  })
  @ApiOkResponse({
    description: 'Comment has been successfully deleted.',
  })
  @Delete(':id')
  public async deleteComment(@Param('id') id: string) {
    await this.service.deleteComment(id);
  }

  @ApiOkResponse({
    type: CommentRdo,
    description: 'Comments has been successfully retrieved.',
    isArray: true,
  })
  @Get('post/:postId/list')
  public async getCommentsList(@Param('postId') postId: string): Promise<CommentRdo[]> {
    const comments = await this.service.getCommentsByPostId(postId);
    return comments.map((comment) => fillObject(CommentRdo, comment));
  }
}
