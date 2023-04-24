import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { fillObject } from '@project/util/util-core';
import { LoginUserRdo } from './rdo/login-user.rdo';
import { ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

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
    const user = await this.authService.validateUser(dto);
    return fillObject(LoginUserRdo, user);
  }
}
