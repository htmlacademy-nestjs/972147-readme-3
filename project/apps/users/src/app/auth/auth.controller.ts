import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { fillObject } from "@project/util/util-core";
import { LoggedUserRdo } from "./rdo/logged-user.rdo";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Post('login')
  public async login(@Body() dto: LoginUserDto) {
    const user = await this.authService.validateUser(dto);
    return fillObject(LoggedUserRdo, user);
  }

  @Post('register')
  public async create(@Body() dto: CreateUserDto) {
    const newUser = await this.authService.registerUser(dto)
    return fillObject(LoggedUserRdo, newUser);
  }

  @Post('reset-password')
  public async resetPassword(@Body() dto: CreateUserDto) {
    const newUser = await this.authService.registerUser(dto)
    return fillObject(LoggedUserRdo, newUser);
  }
}
