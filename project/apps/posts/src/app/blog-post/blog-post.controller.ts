import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BlogPostDtoGeneric } from './dto';
import { BlogPostRdoMap, BlogPostRdoGeneric, LinkPostRdo, QuotePostRdo, TextPostRdo, ImagePostRdo, VideoPostRdo } from './rdo';
import { BlogPostService } from "./blog-post.service";
import { PostTypeEnum } from "@project/shared/app-types";
import { fillObject } from "@project/util/util-core";
import { ClassConstructor } from "class-transformer";
import { ApiExtraModels, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags, getSchemaPath } from "@nestjs/swagger";

const apiExtraModels = [LinkPostRdo, QuotePostRdo, TextPostRdo, ImagePostRdo, VideoPostRdo];

const oneofSchemaResponse = () => ({
  oneOf: apiExtraModels.map((model) => ({ $ref: getSchemaPath(model) })),
});

@ApiExtraModels(...apiExtraModels)
@ApiTags('Posts')
@Controller('posts')
export class BlogPostController {
  constructor(private readonly service: BlogPostService) {
  }

  @ApiParam({name: 'type', enum: PostTypeEnum})
  @ApiOkResponse({
    schema: oneofSchemaResponse(),
    description: 'One of the post types',
  })
  @ApiNotFoundResponse({
    description: 'Post with given id and type not found'
  })
  @Get(':type/:id')
  public async getPost<T extends PostTypeEnum>(@Param('id') id: string, @Param('type') type: T) {
    const post = await this.service.getPost(type, id);
    return fillObject(BlogPostRdoMap[type] as unknown as ClassConstructor<BlogPostRdoGeneric<T>>, post);
  }

  @ApiParam({name: 'type', enum: PostTypeEnum})
  @ApiOkResponse({
    schema: oneofSchemaResponse(),
    description: 'One of the post types',
  })
  @ApiParam({name: 'type', enum: PostTypeEnum})
  @Post(':type/create')
  public async createPost<T extends PostTypeEnum>(@Param() type: T, dto: BlogPostDtoGeneric<T>) {
    const post = await this.service.createPost(type, dto);
    return fillObject(BlogPostRdoMap[type] as unknown as ClassConstructor<BlogPostRdoGeneric<T>>, post);
  }

  @ApiParam({name: 'type', enum: PostTypeEnum})
  @ApiOkResponse({
    schema: oneofSchemaResponse(),
    description: 'One of the post types',
  })
  @ApiParam({name: 'type', enum: PostTypeEnum})
  @Post(':type/:id/update')
  public async updatePost<T extends PostTypeEnum>(@Param('id') id: string, @Param() type: T, dto: BlogPostDtoGeneric<T>) {
    const post = await this.service.updatePost(type, id, dto);
    return fillObject(BlogPostRdoMap[type] as unknown as ClassConstructor<BlogPostRdoGeneric<T>>, post);
  }

  @ApiParam({name: 'type', enum: PostTypeEnum})
  @ApiNotFoundResponse({
    description: 'Post with given id and type not found'
  })
  @Delete(':type/:id')
  public async deletePost<T extends PostTypeEnum>(@Param('id') id: string, @Param() type: T) {
    await this.service.deletePost(type, id);
  }
}
