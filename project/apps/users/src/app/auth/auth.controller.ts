import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { fillObject } from '@project/util/util-core';
import { LoginUserRdo } from './rdo/login-user.rdo';
import { ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { ExtractUser } from '@project/shared/shared-decorators';

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
  @Get('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  public async refreshToken(@ExtractUser() { refreshToken }: { refreshToken: string }): Promise<LoginUserRdo> {
    const tokens = await this.authService.loginByRefreshToken(refreshToken);
    return fillObject(LoginUserRdo, tokens);
  }

  @ApiUnauthorizedResponse({
    description: 'Refresh token is incorrect',
  })
  @ApiOkResponse({
    description: 'User has been successfully logged out.',
  })
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  public async logout(@ExtractUser() { refreshToken }: { refreshToken: string }) {
    await this.authService.logout(refreshToken);
  }

  @ApiUnauthorizedResponse({
    description: 'Refresh token is incorrect',
  })
  @ApiOkResponse({
    description: 'User has been successfully logged out from all devices.',
  })
  @Get('logout-all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  public async logoutAll(@ExtractUser() { refreshToken }: { refreshToken: string }) {
    await this.authService.logoutAll(refreshToken);
  }
}
