import { Body, Controller, Delete, Get, Inject, Param, Post, Req, UploadedFile, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { bffConfig } from '@project/config/config-bff';
import { ConfigType } from '@nestjs/config';
import { AxiosExceptionFilter } from './filters/AxiosExceptionFilter';
import { CheckAuthGuard } from './guards/CheckAuthGuard';
import { BlogPostDtoGeneric } from './dto/posts';
import { PostTypeEnum } from '@project/shared/app-types';
import { ExtractUser } from '@project/shared/shared-decorators';
import { UserId } from './types/user-id';
import { Express, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { imagePostOptions } from './config/imagePostOptions';
import FormData from 'form-data';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  getSchemaPath
} from "@nestjs/swagger";
import { ImagePostRdo, LinkPostRdo, QuotePostRdo, TextPostRdo, VideoPostRdo } from "./rdo/posts";
import { ImagePostDto, LinkPostDto, QuotePostDto, TextPostDto, VideoPostDto } from "./dto/posts";

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

@ApiTags('Posts')
@ApiExtraModels(...apiDtoModels, ...apiRdoModels)
@Controller('posts')
@UseFilters(AxiosExceptionFilter)
export class PostsController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(bffConfig.KEY)
    private readonly bffOptions: ConfigType<typeof bffConfig>
  ) {}

  private mkFilesUrl(path: string) {
    return `${this.bffOptions.filesUrl}/files/${path}`;
  }

  private mkPostsUrl(path: string) {
    return `${this.bffOptions.postsUrl}/posts/${path}`;
  }

  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Limit of posts. Default is 25',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page of posts. Default is 1',
    example: 2,
  })
  @ApiQuery({
    name: 'type',
    enum: PostTypeEnum,
    required: false,
    description: 'Type of posts',
    example: PostTypeEnum.TEXT,
  })
  @ApiQuery({
    name: 'authorIds',
    type: String,
    required: false,
    description: 'Author ids',
    isArray: true,
    example: '1,2,3',
  })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    description: 'Sort by. Default is published',
    example: 'comments | likes | published',
  })
  @ApiQuery({
    name: 'sortDirection',
    type: String,
    required: false,
    description: 'Sort direction. Default is desc',
    example: 'desc | asc',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Search by title',
    example: 'title',
  })
  @ApiOkResponse({
    schema: anyOfRdoSchemaResponse(),
    description: 'List of posts',
    isArray: true,
  })
  @Get('')
  public async getPosts(@Req() req: Request) {
    const query = Object.entries(req.query).map(([key, value]) => `${key}=${value}`).join('&');
    const { data: postsData } = await this.httpService.axiosRef.get(this.mkPostsUrl(`?${query}`));

    return postsData;
  }

  @ApiOkResponse({
    schema: oneofRdoSchemaResponse(),
    description: 'One of the post rdo types',
  })
  @ApiNotFoundResponse({
    description: 'Post with given id and type not found',
  })
  @Get(':id')
  public async getPost(@Param('id') id: string) {
    const { data: postData } = await this.httpService.axiosRef.get(this.mkPostsUrl(id));

    return postData;
  }

  @ApiCreatedResponse({
    schema: oneofRdoSchemaResponse(),
    description: 'Created repost',
  })
  @Post('repost/:postId')
  @UseGuards(CheckAuthGuard)
  public async createRepost(@ExtractUser() user: UserId, @Param('postId') postId: string) {
    const { data: postData } = await this.httpService.axiosRef.post(this.mkPostsUrl('repost'), { postId, authorId: user.userId });

    return postData;
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
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(FileInterceptor('image', imagePostOptions))
  public async createPost(@UploadedFile() image: Express.Multer.File, @ExtractUser() user: UserId, @Body() dto: BlogPostDtoGeneric<PostTypeEnum>) {
    if (dto.type === PostTypeEnum.IMAGE) {
      const form = new FormData();
      form.append('file', image.buffer, image.originalname);
      form.append('ownerId', user.userId);
      const { data } = await this.httpService.axiosRef.postForm(this.mkFilesUrl(''), form);
      dto.imageFileId = data.id;
    }

    try {
      const { data: postData } = await this.httpService.axiosRef.post(this.mkPostsUrl(''), { ...dto, authorId: user.userId });
      return postData;
    } catch (e) {
      if (dto.type === PostTypeEnum.IMAGE) {
        await this.httpService.axiosRef.post(this.mkFilesUrl('delete'), { fileId: dto.imageFileId, ownerId: user.userId });
      }
      throw e;
    }
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
  @UseInterceptors(FileInterceptor('image', imagePostOptions))
  @UseGuards(CheckAuthGuard)
  public async updatePost(
    @Param('id') id: string,
    @ExtractUser() user: UserId,
    @Body() dto: BlogPostDtoGeneric<PostTypeEnum>,
    @UploadedFile() image: Express.Multer.File
  ) {
    if (dto.type === PostTypeEnum.IMAGE) {
      const { data: oldPost } = await this.httpService.axiosRef.get(this.mkPostsUrl(id));
      await this.httpService.axiosRef.post(this.mkFilesUrl('delete'), { fileId: oldPost.imageFileId, ownerId: user.userId });
      const form = new FormData();
      form.append('file', image.buffer, image.originalname);
      form.append('ownerId', user.userId);
      const { data } = await this.httpService.axiosRef.postForm(this.mkFilesUrl(''), form);
      dto.imageFileId = data.id;
    }

    try {
      const { data: postData } = await this.httpService.axiosRef.post(this.mkPostsUrl(id), { ...dto, authorId: user.userId });
      return postData;
    } catch (e) {
      if (dto.type === PostTypeEnum.IMAGE) {
        await this.httpService.axiosRef.post(this.mkFilesUrl('delete'), { fileId: dto.imageFileId, ownerId: user.userId });
      }
      throw e;
    }
  }

  @ApiNotFoundResponse({
    description: 'Post with given id and type not found',
  })
  @ApiBadRequestResponse({
    description: 'Author id and post id do not match',
  })
  @ApiOkResponse({
    description: 'Post successfully deleted',
  })
  @Delete(':id')
  @UseGuards(CheckAuthGuard)
  public async deletePost(@ExtractUser() user: UserId, @Param('id') id: string) {
    const { data: post } = await this.httpService.axiosRef.get(this.mkPostsUrl(id));
    if (post.type === PostTypeEnum.IMAGE) {
      await this.httpService.axiosRef.post(this.mkFilesUrl('delete'), { fileId: post.imageFileId, ownerId: user.userId });
    }
    await this.httpService.axiosRef.post(this.mkPostsUrl(`delete`), { authorId: user.userId, postId: id });
    return;
  }
}
