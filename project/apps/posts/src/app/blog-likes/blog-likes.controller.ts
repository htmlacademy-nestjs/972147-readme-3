import { Controller, Delete, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BlogLikesService } from './blog-likes.service';
import { AuthAccessGuard } from '../blog-auth/guards/auth-access.guard';
import { ExtractUser } from '@project/shared/shared-decorators';
import { User } from '@project/shared/app-types';

@ApiTags('Likes')
@Controller('likes')
export class BlogLikesController {
  constructor(private readonly service: BlogLikesService) {}

  @ApiNotFoundResponse({
    description: 'Post not found',
  })
  @ApiConflictResponse({
    description: 'Post already liked',
  })
  @ApiOkResponse({
    description: 'Post has been successfully liked.',
  })
  @UseGuards(AuthAccessGuard)
  @Post('post/:postId/like')
  public async likePost(@Param('postId', ParseUUIDPipe) postId: string, @ExtractUser() user: User) {
    await this.service.likePost(user.id, postId);
  }

  @ApiNotFoundResponse({
    description: 'Post not found or like does not exist',
  })
  @ApiOkResponse({
    description: 'Post has been successfully unliked.',
  })
  @UseGuards(AuthAccessGuard)
  @Delete('post/:postId/unlike')
  public async unlikePost(@Param('postId', ParseUUIDPipe) postId: string, @ExtractUser() user: User) {
    await this.service.unlikePost(user.id, postId);
  }
}
