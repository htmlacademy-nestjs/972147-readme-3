import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from "@nestjs/common";
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BlogCommentsService } from './blog-comments.service';
import { fillObject } from '@project/util/util-core';
import { CommentRdo } from './rdo/comment.rdo';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { BlogCommentQuery } from './query/blog-comment.query';
import { AuthAccessGuard } from "../blog-auth/guards/auth-access.guard";
import { ExtractUser } from "@project/shared/shared-decorators";
import { User } from "@project/shared/app-types";

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

  @ApiCreatedResponse({
    type: CommentRdo,
    description: 'Comment has been successfully created.',
  })
  @UseGuards(AuthAccessGuard)
  @Post('create')
  public async createComment(@Body() dto: CreateCommentDto, @ExtractUser() user: User) {
    const comment = await this.service.createComment(user.id, dto);
    return fillObject(CommentRdo, comment);
  }

  @ApiOkResponse({
    type: CommentRdo,
    description: 'Comment has been successfully updated.',
  })
  @UseGuards(AuthAccessGuard)
  @Post(':id/update')
  public async updateComment(@Param('id', ParseUUIDPipe) commentId: string, @Body() dto: UpdateCommentDto, @ExtractUser() user: User) {
    const comment = await this.service.updateComment(user.id, commentId, dto);
    return fillObject(CommentRdo, comment);
  }

  @ApiNotFoundResponse({
    description: 'Comment not found',
  })
  @ApiOkResponse({
    description: 'Comment has been successfully deleted.',
  })
  @UseGuards(AuthAccessGuard)
  @Delete(':id')
  public async deleteComment(@Param('id', ParseUUIDPipe) commentId: string, @ExtractUser() user: User) {
    await this.service.deleteComment(user.id, commentId);
  }

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
