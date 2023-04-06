import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { fillObject } from "@project/util/util-core";
import { LoggedUserRdo } from "./rdo/logged-user.rdo";
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @ApiOkResponse({
    type: LoggedUserRdo,
    description: 'User has been successfully logged.'
  })
  @ApiUnauthorizedResponse({
    description: 'Email or password is incorrect'
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() dto: LoginUserDto): Promise<LoggedUserRdo> {
    const user = await this.authService.validateUser(dto);
    return fillObject(LoggedUserRdo, user);
  }

  @ApiCreatedResponse({
    type: LoggedUserRdo,
    description: 'User has been successfully registered.'
  })
  @ApiConflictResponse({
    status: HttpStatus.CONFLICT,
    description: 'User with this email already exists'
  })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() dto: CreateUserDto): Promise<LoggedUserRdo> {
    const newUser = await this.authService.registerUser(dto)
    return fillObject(LoggedUserRdo, newUser);
  }
}
