import { Body, Controller, Get, Inject, Param, Post, Req, UploadedFile, UseFilters, UseInterceptors } from '@nestjs/common';
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

  @Get('profile')
  public async getProfile(@Req() req: Request) {
    const { data: userData } = await this.httpService.axiosRef.get(this.mkUsersUrl('profile'), this.getAuthHeader(req));
    const { data: postsData } = await this.httpService.axiosRef.get(this.mkPostsUrl(`get-count-posts/${userData.id}`));
    const { data: notificationsData } = await this.httpService.axiosRef.get(this.mkNotificationUrl(`${userData.id}/count-subscribers`));

    return fillObject(UserRdo, { ...userData, postsCount: postsData.count, subscribersCount: notificationsData.count });
  }

  @Get(':id')
  public async getUser(@Param('id') id: string, @Req() req: Request) {
    const { data: userData } = await this.httpService.axiosRef.get(this.mkUsersUrl(id), this.getAuthHeader(req));
    const { data: postsData } = await this.httpService.axiosRef.get(this.mkPostsUrl(`get-count-posts/${userData.id}`));
    const { data: notificationsData } = await this.httpService.axiosRef.get(this.mkNotificationUrl(`${userData.id}/count-subscribers`));

    return fillObject(UserRdo, { ...userData, postsCount: postsData.count, subscribersCount: notificationsData.count });
  }

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

  @Post('change-password')
  public async changePassword(@Body() dto: UpdatePasswordDto, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(this.mkUsersUrl('change-password'), dto, this.getAuthHeader(req));

    return data;
  }

  @Post('subscribe/:id')
  public async subscribe(@Param('id') id: string, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(this.mkUsersUrl(`subscribe/${id}`), null, this.getAuthHeader(req));

    return data;
  }

  @Post('unsubscribe/:id')
  public async unsubscribe(@Param('id') id: string, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.delete(this.mkUsersUrl(`unsubscribe/${id}`), this.getAuthHeader(req));

    return data;
  }
}
