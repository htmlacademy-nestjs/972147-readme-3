import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { fillObject } from '@project/util/util-core';
import { LoginUserRdo } from './rdo/login-user.rdo';
import { ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
  public async refreshToken(@Req() req: Request) {
    const user = req.user as { refreshToken: string };
    const tokens = await this.authService.loginByRefreshToken(user.refreshToken);
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
  public async logout(@Req() req: Request) {
    const user = req.user as { refreshToken: string };
    await this.authService.logout(user.refreshToken);
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
  public async logoutAll(@Req() req: Request) {
    const user = req.user as { refreshToken: string };
    await this.authService.logoutAll(user.refreshToken);
  }
}
