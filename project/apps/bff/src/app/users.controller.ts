import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Req, UploadedFile, UseFilters, UseInterceptors } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { bffConfig } from '@project/config/config-bff';
import { ConfigType } from '@nestjs/config';
import { AxiosExceptionFilter } from './filters/AxiosExceptionFilter';
import { Express, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/user/create-user.dto';
import 'multer';
import { userAvatarOptions } from './config/userAvatarConfig';
import { UpdatePasswordDto } from './dto/user/update-password.dto';
import FormData from 'form-data';
import { fillObject } from '@project/util/util-core';
import { UserRdo } from './rdo/user/user.rdo';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseFilters(AxiosExceptionFilter)
export class UsersController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(bffConfig.KEY)
    private readonly bffOptions: ConfigType<typeof bffConfig>
  ) {}

  private mkUsersUrl(path: string) {
    return `${this.bffOptions.usersUrl}/users/${path}`;
  }

  private mkFilesUrl(path: string) {
    return `${this.bffOptions.filesUrl}/files/${path}`;
  }

  private mkNotificationUrl(path: string) {
    return `${this.bffOptions.notificationUrl}/${path}`;
  }

  private mkPostsUrl(path: string) {
    return `${this.bffOptions.postsUrl}/posts/${path}`;
  }

  private getAuthHeader(req: Request) {
    return {
      headers: {
        Authorization: req.headers['authorization'],
      },
    };
  }

  @ApiOkResponse({
    type: UserRdo,
    description: 'User has been successfully retrieved.',
  })
  @ApiBadRequestResponse({
    description: 'User not provided or invalid data',
  })
  @Get('profile')
  public async getProfile(@Req() req: Request) {
    const { data: userData } = await this.httpService.axiosRef.get(this.mkUsersUrl('profile'), this.getAuthHeader(req));
    const { data: postsData } = await this.httpService.axiosRef.get(this.mkPostsUrl(`get-count-posts/${userData.id}`));
    const { data: notificationsData } = await this.httpService.axiosRef.get(this.mkNotificationUrl(`${userData.id}/count-subscribers`));

    console.log();
    return fillObject(UserRdo, { ...userData, postsCount: postsData.count, subscribersCount: notificationsData.count });
  }

  @ApiOkResponse({
    type: UserRdo,
    description: 'User has been successfully retrieved.',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Get(':id')
  public async getUser(@Param('id') id: string, @Req() req: Request) {
    const { data: userData } = await this.httpService.axiosRef.get(this.mkUsersUrl(id), this.getAuthHeader(req));
    const { data: postsData } = await this.httpService.axiosRef.get(this.mkPostsUrl(`get-count-posts/${userData.id}`));
    const { data: notificationsData } = await this.httpService.axiosRef.get(this.mkNotificationUrl(`${userData.id}/count-subscribers`));

    return fillObject(UserRdo, { ...userData, postsCount: postsData.count, subscribersCount: notificationsData.count });
  }

  @ApiCreatedResponse({
    type: UserRdo,
    description: 'User has been successfully created',
  })
  @ApiConflictResponse({
    status: HttpStatus.CONFLICT,
    description: 'User with this email already exists',
  })
  @Post('')
  @UseInterceptors(FileInterceptor('avatar', userAvatarOptions))
  public async createUser(@UploadedFile() avatar: Express.Multer.File, @Body() dto: CreateUserDto) {
    if (avatar) {
      const form = new FormData();
      form.append('file', avatar.buffer, avatar.originalname);
      const { data } = await this.httpService.axiosRef.postForm(this.mkFilesUrl(''), form);
      dto.avatarFileId = data.id;
    }

    try {
      const { data } = await this.httpService.axiosRef.post(this.mkUsersUrl(''), dto);
      return data;
    } catch (e) {
      if (dto.avatarFileId) {
        await this.httpService.axiosRef.post(this.mkFilesUrl('delete'), { fileId: dto.avatarFileId });
      }
      throw e;
    }
  }

  @ApiOkResponse({
    description: 'Password has been successfully updated',
  })
  @ApiConflictResponse({
    description: 'Old password is incorrect',
  })
  @ApiBadRequestResponse({
    description: 'User not provided in toke or invalid data',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @HttpCode(HttpStatus.OK)
  @Post('password')
  public async changePassword(@Body() dto: UpdatePasswordDto, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(this.mkUsersUrl('change-password'), dto, this.getAuthHeader(req));

    return data;
  }

  @ApiOkResponse({
    description: 'User has been successfully subscribed to updates from another user',
  })
  @ApiBadRequestResponse({
    description: 'User not provided or invalid data',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @HttpCode(HttpStatus.OK)
  @Post('subscribe/:id')
  public async subscribe(@Param('id') id: string, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(this.mkUsersUrl(`subscribe/${id}`), null, this.getAuthHeader(req));

    return data;
  }

  @ApiOkResponse({
    description: 'User has been successfully subscribed to updates from another user',
  })
  @ApiBadRequestResponse({
    description: 'User not provided or invalid data',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Delete('unsubscribe/:userId')
  public async unsubscribe(@Param('userId') userId: string, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.delete(this.mkUsersUrl(`unsubscribe/${userId}`), this.getAuthHeader(req));

    return data;
  }
}
