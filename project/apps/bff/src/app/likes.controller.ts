import { Controller, Delete, Inject, Param, Post, UseFilters, UseGuards } from "@nestjs/common";
import { CheckAuthGuard } from "./guards/CheckAuthGuard";
import { ExtractUser } from "@project/shared/shared-decorators";
import { UserId } from "./types/user-id";
import { HttpService } from "@nestjs/axios";
import { bffConfig } from "@project/config/config-bff";
import { ConfigType } from "@nestjs/config";
import { AxiosExceptionFilter } from "./filters/AxiosExceptionFilter";
import { ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Likes')
@Controller('likes')
@UseFilters(AxiosExceptionFilter)
export class LikesController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(bffConfig.KEY)
    private readonly bffOptions: ConfigType<typeof bffConfig>
  ) {}

  private mkLikesUrl(path: string) {
    return `${this.bffOptions.postsUrl}/likes/${path}`;
  }

  @ApiNotFoundResponse({
    description: 'Post not found',
  })
  @ApiConflictResponse({
    description: 'Post already liked',
  })
  @ApiOkResponse({
    description: 'Post has been successfully liked.',
  })

  @Post(':postId')
  @UseGuards(CheckAuthGuard)
  public async createLike(@ExtractUser() user: UserId, @Param('postId') postId: string) {
    const { data: likeData } = await this.httpService.axiosRef.post(this.mkLikesUrl('like'), { postId, authorId: user.userId });

    return likeData;
  }

  @ApiNotFoundResponse({
    description: 'Post not found or like does not exist',
  })
  @ApiOkResponse({
    description: 'Post has been successfully unliked.',
  })
  @Delete(':postId')
  @UseGuards(CheckAuthGuard)
  public async deleteLike(@ExtractUser() user: UserId, @Param('postId') postId: string) {
    const { data: unlikeData } = await this.httpService.axiosRef.post(this.mkLikesUrl('unlike'), { postId, authorId: user.userId });

    return unlikeData;
  }
}
