import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { BlogUserService } from './blog-user.service';
import { fillObject } from '@project/util/util-core';
import { UserRdo } from './rdo/user.rdo';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ApiTags, ApiOkResponse, ApiNotFoundResponse, ApiConflictResponse, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { MongoidValidationPipe } from '@project/shared/shared-pipes';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { TokenPayload } from '@project/shared/app-types';
import { LoggedUserRdo } from './rdo/logged-user.rdo';

@ApiTags('Users')
@Controller('users')
export class BlogUserController {
  constructor(private readonly blogUserService: BlogUserService) {}

  @ApiOkResponse({
    type: LoggedUserRdo,
    description: '',
  })
  @ApiBadRequestResponse({
    description: 'User not provided or invalid data',
  })
  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  public async injectUserFromToken(@Req() req: Request): Promise<LoggedUserRdo> {
    const user = req.user as TokenPayload | undefined;
    if (user && user.sub && user.email && user.firstName && user.lastName) {
      return fillObject(LoggedUserRdo, { ...user, id: user.sub });
    }
    throw new BadRequestException('User not provided or invalid data');
  }

  @ApiOkResponse({
    type: UserRdo,
    description: 'User has been successfully retrieved.',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getUserById(@Param('id', MongoidValidationPipe) id: string): Promise<UserRdo> {
    const user = await this.blogUserService.getUser(id);
    return fillObject(UserRdo, user);
  }

  @ApiCreatedResponse({
    type: UserRdo,
    description: 'User has been successfully registered.',
  })
  @ApiConflictResponse({
    status: HttpStatus.CONFLICT,
    description: 'User with this email already exists',
  })
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() dto: CreateUserDto): Promise<UserRdo> {
    const newUser = await this.blogUserService.registerUser(dto);
    return fillObject(UserRdo, newUser);
  }

  @ApiOkResponse({
    description: 'Password has been successfully updated',
  })
  @ApiConflictResponse({
    description: 'Old password is incorrect',
  })
  @ApiBadRequestResponse({
    description: 'User not provided or invalid data',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  public async changePassword(@Body() dto: UpdatePasswordDto, @Req() req: Request) {
    const user = req.user as TokenPayload | undefined;
    if (!user) {
      throw new BadRequestException('User not provided');
    }
    await this.blogUserService.updatePassword(user.sub, dto);
  }
}
