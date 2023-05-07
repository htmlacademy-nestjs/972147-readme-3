import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { BlogPostDtoGeneric, VideoPostDto, LinkPostDto, QuotePostDto, TextPostDto, ImagePostDto, DeletePostDto } from './dto';
import { LinkPostRdo, QuotePostRdo, TextPostRdo, ImagePostRdo, VideoPostRdo, getBlogPostRdo } from './rdo';
import { BlogPostService } from './blog-post.service';
import { PostTypeEnum } from '@project/shared/app-types';
import { fillObject } from '@project/util/util-core';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { PostDtoValidationPipe } from './pipes/post-dto-validation.pipe';
import { BlogPostQuery } from './query/blog-post.query';
import { CreateRepostDto } from './dto/create-repost.dto';
import { AuthorPostsCountRdo } from './rdo/author-posts-count.rdo';
import { NotifyService } from "../notify/notify.service";

const apiRdoModels = [LinkPostRdo, QuotePostRdo, TextPostRdo, ImagePostRdo, VideoPostRdo];
const apiDtoModels = [LinkPostDto, QuotePostDto, TextPostDto, ImagePostDto, VideoPostDto];

const oneofRdoSchemaResponse = () => ({
  oneOf: apiRdoModels.map((model) => ({ $ref: getSchemaPath(model) })),
});

const oneofDtoSchemaResponse = () => ({
  oneOf: apiDtoModels.map((model) => ({ $ref: getSchemaPath(model) })),
});

const anyOfRdoSchemaResponse = () => ({
  anyOf: apiRdoModels.map((model) => ({ $ref: getSchemaPath(model) })),
});

@ApiExtraModels(...apiDtoModels, ...apiRdoModels)
@ApiTags('Posts')
@Controller('posts')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService, private readonly notifyService: NotifyService) {}

  @ApiOkResponse({
    schema: oneofRdoSchemaResponse(),
    description: 'One of the post rdo types',
  })
  @ApiNotFoundResponse({
    description: 'Post with given id and type not found',
  })
  @Get(':id')
  public async getPost(@Param('id', ParseUUIDPipe) id: string) {
    const post = await this.blogPostService.getPost(id);
    return fillObject(getBlogPostRdo(post.type), post);
  }

  @ApiCreatedResponse({
    schema: oneofRdoSchemaResponse(),
    description: 'One of the post rdo types',
  })
  @ApiBody({
    schema: oneofDtoSchemaResponse(),
    description: 'One of the post dto types',
  })
  @Post('')
  public async createPost<T extends PostTypeEnum>(@Body(PostDtoValidationPipe) dto: BlogPostDtoGeneric<T>) {
    const post = await this.blogPostService.createPost(dto);
    await this.notifyService.addNewPost(post);
    return fillObject(getBlogPostRdo(post.type), post);
  }

  @ApiNotFoundResponse({
    description: 'Post with given id and type not found',
  })
  @ApiBadRequestResponse({
    description: 'Post is already reposted',
  })
  @ApiCreatedResponse({
    schema: oneofRdoSchemaResponse(),
    description: 'One of the post rdo types',
  })
  @Post('repost')
  public async createRepost(@Body() dto: CreateRepostDto) {
    const repost = await this.blogPostService.createRepost(dto);
    await this.notifyService.addNewPost(repost);
    return fillObject(getBlogPostRdo(repost.type), repost);
  }

  @ApiOkResponse({
    type: AuthorPostsCountRdo,
  })
  @Get('get-count-posts/:authorId')
  public async getCountPosts(@Param('authorId') authorId: string) {
    const countPosts = await this.blogPostService.getPostsCountByAuthorId(authorId);
    return fillObject(AuthorPostsCountRdo, { count: countPosts });
  }

  @ApiOkResponse({
    schema: oneofRdoSchemaResponse(),
    description: 'One of the post types',
  })
  @ApiBody({
    schema: oneofDtoSchemaResponse(),
    description: 'One of the post dto types',
  })
  @Post(':id')
  @HttpCode(HttpStatus.OK)
  public async updatePost<T extends PostTypeEnum>(@Param('id', ParseUUIDPipe) postId: string, @Body(PostDtoValidationPipe) dto: BlogPostDtoGeneric<T>) {
    const post = await this.blogPostService.updatePost(postId, dto);
    if (post.status === 'draft') {
      await this.notifyService.deleteNewPost(post.id);
    }
    return fillObject(getBlogPostRdo(post.type), post);
  }

  @ApiBody({
    type: DeletePostDto,
    description: 'Delete post dto',
  })
  @ApiNotFoundResponse({
    description: 'Post with given id and type not found',
  })
  @ApiBadRequestResponse({
    description: 'Author id and post id do not match',
  })
  @ApiOkResponse({
    description: 'Post successfully deleted',
  })
  @HttpCode(HttpStatus.OK)
  @Post('delete')
  public async deletePost(@Body() dto: DeletePostDto) {
    await this.blogPostService.deletePost(dto);
    await this.notifyService.deleteNewPost(dto.postId);
  }

  @ApiOkResponse({
    schema: anyOfRdoSchemaResponse(),
    description: 'List of posts',
    isArray: true,
  })
  @Get('')
  public async listPosts(@Query() query: BlogPostQuery) {
    return await this.blogPostService.listPosts(query);
  }
}
