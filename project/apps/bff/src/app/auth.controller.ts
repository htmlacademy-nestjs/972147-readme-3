import { Body, Controller, HttpCode, HttpStatus, Inject, Post, Req, UseFilters } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { bffConfig } from '@project/config/config-bff';
import { LoginUserDto } from './dto/user/login-user.dto';
import { Request } from 'express';
import { AxiosExceptionFilter } from './filters/AxiosExceptionFilter';
import { ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { LoginUserRdo } from "./rdo/user/login-user.rdo";

@ApiTags('Authentication')
@Controller('auth')
@UseFilters(AxiosExceptionFilter)
export class AuthController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(bffConfig.KEY)
    private readonly bffOptions: ConfigType<typeof bffConfig>
  ) {}

  private getAuthHeader(req: Request) {
    return {
      headers: {
        Authorization: req.headers['authorization'],
      },
    };
  }

  private mkAuthUrl(path: string) {
    return `${this.bffOptions.usersUrl}/auth/${path}`;
  }

  @ApiOkResponse({
    type: LoginUserRdo,
    description: 'User has been successfully logged.',
  })
  @ApiUnauthorizedResponse({
    description: 'Email or password is incorrect',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async login(@Body() dto: LoginUserDto) {
    const { data } = await this.httpService.axiosRef.post(this.mkAuthUrl('login'), dto);
    return data;
  }

  @ApiOkResponse({
    type: LoginUserRdo,
    description: 'User has been successfully logged.',
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token is incorrect',
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  public async refreshToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(this.mkAuthUrl('refresh'), null, this.getAuthHeader(req));

    return data;
  }

  @ApiUnauthorizedResponse({
    description: 'Refresh token is incorrect',
  })
  @ApiOkResponse({
    description: 'User has been successfully logged out.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  public async logout(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(this.mkAuthUrl('logout'), null, this.getAuthHeader(req));

    return data;
  }

  @ApiUnauthorizedResponse({
    description: 'Refresh token is incorrect',
  })
  @ApiOkResponse({
    description: 'User has been successfully logged out from all devices.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('logout-all')
  public async logoutAll(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(this.mkAuthUrl('logout-all'), null, this.getAuthHeader(req));

    return data;
  }
}
