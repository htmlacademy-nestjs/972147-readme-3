import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { BlogPostDtoGeneric, VideoPostDto, LinkPostDto, QuotePostDto, TextPostDto, ImagePostDto } from './dto';
import {
  BlogPostRdoMap,
  BlogPostRdoGeneric,
  LinkPostRdo,
  QuotePostRdo,
  TextPostRdo,
  ImagePostRdo,
  VideoPostRdo
} from './rdo';
import { BlogPostService } from "./blog-post.service";
import { PostTypeEnum } from "@project/shared/app-types";
import { fillObject } from "@project/util/util-core";
import { ClassConstructor } from "class-transformer";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  getSchemaPath
} from "@nestjs/swagger";

const apiRdoModels = [LinkPostRdo, QuotePostRdo, TextPostRdo, ImagePostRdo, VideoPostRdo];
const apiDtoModels = [LinkPostDto, QuotePostDto, TextPostDto, ImagePostDto, VideoPostDto];

const oneofRdoSchemaResponse = () => ({
  oneOf: apiRdoModels.map((model) => ({$ref: getSchemaPath(model)})),
});

const oneofDtoSchemaResponse = () => ({
  oneOf: apiDtoModels.map((model) => ({$ref: getSchemaPath(model)})),
});

@ApiExtraModels(...apiDtoModels, ...apiRdoModels)
@ApiTags('Posts')
@Controller('posts')
export class BlogPostController {
  constructor(private readonly service: BlogPostService) {
  }

  @ApiOkResponse({
    schema: oneofRdoSchemaResponse(),
    description: 'One of the post rdo types',
  })
  @ApiNotFoundResponse({
    description: 'Post with given id and type not found'
  })
  @ApiParam({name: 'type', enum: PostTypeEnum})
  @Get(':type/:id')
  public async getPost<T extends PostTypeEnum>(@Param('id') id: string, @Param('type') type: T) {
    const post = await this.service.getPost(type, id);
    return fillObject(BlogPostRdoMap[type] as unknown as ClassConstructor<BlogPostRdoGeneric<T>>, post);
  }

  @ApiCreatedResponse({
    schema: oneofRdoSchemaResponse(),
    description: 'One of the post rdo types',
  })
  @ApiBody({
    schema: oneofDtoSchemaResponse(),
    description: 'One of the post dto types',
  })
  @ApiParam({name: 'type', enum: PostTypeEnum})
  @Post(':type/create')
  public async createPost<T extends PostTypeEnum>(@Param('type') type: T, @Body() dto: BlogPostDtoGeneric<T>) {
    const post = await this.service.createPost(type, dto);
    return fillObject(BlogPostRdoMap[type] as unknown as ClassConstructor<BlogPostRdoGeneric<T>>, post);
  }

  @ApiOkResponse({
    schema: oneofRdoSchemaResponse(),
    description: 'One of the post types',
  })
  @ApiParam({name: 'type', enum: PostTypeEnum})
  @ApiBody({
    schema: oneofDtoSchemaResponse(),
    description: 'One of the post dto types',
  })
  @Post(':type/:id/update')
  @HttpCode(HttpStatus.OK)
  public async updatePost<T extends PostTypeEnum>(@Param('id') id: string, @Param('type') type: T, @Body() dto: BlogPostDtoGeneric<T>) {
    const post = await this.service.updatePost(type, id, dto);
    return fillObject(BlogPostRdoMap[type] as unknown as ClassConstructor<BlogPostRdoGeneric<T>>, post);
  }

  @ApiNotFoundResponse({
    description: 'Post with given id and type not found'
  })
  @ApiOkResponse({
    description: 'Post successfully deleted'
  })
  @ApiParam({name: 'type', enum: PostTypeEnum})
  @Delete(':type/:id')
  public async deletePost<T extends PostTypeEnum>(@Param('id') id: string, @Param('type') type: T) {
    await this.service.deletePost(type, id);
  }
}
