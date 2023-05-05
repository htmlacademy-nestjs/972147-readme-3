import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { fillObject } from '@project/util/util-core';
import { LoginUserRdo } from './rdo/login-user.rdo';
import { ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { ExtractUser } from '@project/shared/shared-decorators';
import { TokenPayload } from "@project/shared/app-types";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CheckUserRdo } from "./rdo/check-user.rdo";

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    type: LoginUserRdo,
    description: 'User has been successfully logged.',
  })
  @ApiUnauthorizedResponse({
    description: 'Email or password is incorrect',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() dto: LoginUserDto): Promise<LoginUserRdo> {
    const tokens = await this.authService.login(dto);
    return fillObject(LoginUserRdo, tokens);
  }

  @ApiOkResponse({
    type: LoginUserRdo,
    description: 'User has been successfully logged.',
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token is incorrect',
  })
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  public async refreshToken(@ExtractUser() payload: TokenPayload): Promise<LoginUserRdo> {
    const tokens = await this.authService.loginByRefreshToken(payload);
    return fillObject(LoginUserRdo, tokens);
  }

  @ApiOkResponse({
    type: CheckUserRdo,
    description: 'User token has been successfully checked.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token is incorrect',
  })
  @Post('check')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  public async check(@ExtractUser() payload: TokenPayload): Promise<CheckUserRdo> {
    return fillObject(CheckUserRdo, { userId: payload.sub});
  }

  @ApiUnauthorizedResponse({
    description: 'Refresh token is incorrect',
  })
  @ApiOkResponse({
    description: 'User has been successfully logged out.',
  })
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  public async logout(@ExtractUser() payload: TokenPayload) {
    await this.authService.logout(payload);
  }

  @ApiUnauthorizedResponse({
    description: 'Refresh token is incorrect',
  })
  @ApiOkResponse({
    description: 'User has been successfully logged out from all devices.',
  })
  @Get('logout-all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  public async logoutAll(@ExtractUser() payload: TokenPayload) {
    await this.authService.logoutAll(payload);
  }
}
