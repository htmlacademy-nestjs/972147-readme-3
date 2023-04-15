import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { BlogLikesService } from "./blog-likes.service";

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
  @Post('post/:postId/like')
  public async likePost(@Param('postId') postId: string) {
    await this.service.likePost(postId);
  }

  @ApiNotFoundResponse({
    description: 'Post not found or like does not exist',
  })
  @ApiOkResponse({
    description: 'Post has been successfully unliked.',
  })
  @Delete('post/:postId/unlike')
  public async unlikePost(@Param('postId') postId: string) {
    await this.service.unlikePost(postId);
  }
}
