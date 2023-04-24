import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { BlogPostDtoGeneric, VideoPostDto, LinkPostDto, QuotePostDto, TextPostDto, ImagePostDto } from './dto';
import { LinkPostRdo, QuotePostRdo, TextPostRdo, ImagePostRdo, VideoPostRdo, getBlogPostRdo } from './rdo';
import { BlogPostService } from './blog-post.service';
import { PostTypeEnum } from '@project/shared/app-types';
import { fillObject } from '@project/util/util-core';
import { ApiBody, ApiCreatedResponse, ApiExtraModels, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { PostDtoValidationPipe } from "./pipes/post-dto-validation.pipe";

const apiRdoModels = [LinkPostRdo, QuotePostRdo, TextPostRdo, ImagePostRdo, VideoPostRdo];
const apiDtoModels = [LinkPostDto, QuotePostDto, TextPostDto, ImagePostDto, VideoPostDto];

const oneofRdoSchemaResponse = () => ({
  oneOf: apiRdoModels.map((model) => ({ $ref: getSchemaPath(model) })),
});

const oneofDtoSchemaResponse = () => ({
  oneOf: apiDtoModels.map((model) => ({ $ref: getSchemaPath(model) })),
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
  @Post('')
  public async createPost<T extends PostTypeEnum>(@Body(PostDtoValidationPipe) dto: BlogPostDtoGeneric<T>) {
    const post = await this.service.createPost(dto);
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
  @HttpCode(HttpStatus.OK)
  public async updatePost<T extends PostTypeEnum>(@Param('id', ParseUUIDPipe) id: string, @Body(PostDtoValidationPipe) dto: BlogPostDtoGeneric<T>) {
    const post = await this.service.updatePost(id, dto);
    return fillObject(getBlogPostRdo(post.type), post);
  }

  @ApiNotFoundResponse({
    description: 'Post with given id and type not found',
  })
  @ApiOkResponse({
    description: 'Post successfully deleted',
  })
  @Delete(':id')
  public async deletePost(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.deletePost(id);
  }
}
