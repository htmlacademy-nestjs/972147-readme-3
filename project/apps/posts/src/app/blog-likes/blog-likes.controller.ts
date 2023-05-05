import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BlogLikesService } from './blog-likes.service';
import { LikeDto } from "./dto/like.dto";

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
  @Post('like')
  public async likePost(@Body() dto: LikeDto) {
    await this.service.likePost(dto);
  }

  @ApiNotFoundResponse({
    description: 'Post not found or like does not exist',
  })
  @ApiOkResponse({
    description: 'Post has been successfully unliked.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('unlike')
  public async unlikePost(@Body() dto: LikeDto) {
    await this.service.unlikePost(dto);
  }
}
