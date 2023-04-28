import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BlogPostDtoGeneric, VideoPostDto, LinkPostDto, QuotePostDto, TextPostDto, ImagePostDto } from './dto';
import { LinkPostRdo, QuotePostRdo, TextPostRdo, ImagePostRdo, VideoPostRdo, getBlogPostRdo } from './rdo';
import { BlogPostService } from './blog-post.service';
import { PostTypeEnum, User } from '@project/shared/app-types';
import { fillObject } from '@project/util/util-core';
import { ApiBody, ApiCreatedResponse, ApiExtraModels, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { PostDtoValidationPipe } from './pipes/post-dto-validation.pipe';
import { BlogPostQuery } from './query/blog-post.query';
import { AuthAccessGuard } from '../blog-auth/guards/auth-access.guard';
import { ExtractUser } from '@project/shared/shared-decorators';

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
  constructor(private readonly service: BlogPostService) {}

  @ApiOkResponse({
    schema: oneofRdoSchemaResponse(),
    description: 'One of the post rdo types',
  })
  @ApiNotFoundResponse({
    description: 'Post with given id and type not found',
  })
  @Get(':id')
  public async getPost(@Param('id', ParseUUIDPipe) id: string) {
    const post = await this.service.getPost(id);
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
  @ApiParam({ name: 'type', enum: PostTypeEnum })
  @UseGuards(AuthAccessGuard)
  @Post('')
  public async createPost<T extends PostTypeEnum>(@Body(PostDtoValidationPipe) dto: BlogPostDtoGeneric<T>, @ExtractUser() user: User) {
    const post = await this.service.createPost(user.id, dto);
    return fillObject(getBlogPostRdo(post.type), post);
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
  @UseGuards(AuthAccessGuard)
  @HttpCode(HttpStatus.OK)
  public async updatePost<T extends PostTypeEnum>(
    @Param('id', ParseUUIDPipe) postId: string,
    @Body(PostDtoValidationPipe) dto: BlogPostDtoGeneric<T>,
    @ExtractUser() user: User
  ) {
    const post = await this.service.updatePost(user.id, postId, dto);
    return fillObject(getBlogPostRdo(post.type), post);
  }

  @ApiNotFoundResponse({
    description: 'Post with given id and type not found',
  })
  @ApiOkResponse({
    description: 'Post successfully deleted',
  })
  @UseGuards(AuthAccessGuard)
  @Delete(':id')
  public async deletePost(@Param('id', ParseUUIDPipe) postId: string, @ExtractUser() user: User) {
    await this.service.deletePost(user.id, postId);
  }

  @ApiOkResponse({
    schema: anyOfRdoSchemaResponse(),
    description: 'List of posts',
    isArray: true,
  })
  @Get('')
  public async listPosts(@Query() query: BlogPostQuery) {
    return await this.service.listPosts(query);
  }
}
