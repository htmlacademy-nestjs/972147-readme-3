import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { fillObject } from "@project/util/util-core";
import { LoggedUserRdo } from "./rdo/logged-user.rdo";
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @ApiResponse({ type: LoggedUserRdo })
  @Post('login')
  public async login(@Body() dto: LoginUserDto): Promise<LoggedUserRdo> {
    const user = await this.authService.validateUser(dto);
    return fillObject(LoggedUserRdo, user);
  }

  @ApiResponse({ type: LoggedUserRdo })
  @Post('register')
  public async create(@Body() dto: CreateUserDto): Promise<LoggedUserRdo> {
    const newUser = await this.authService.registerUser(dto)
    return fillObject(LoggedUserRdo, newUser);
  }
}
