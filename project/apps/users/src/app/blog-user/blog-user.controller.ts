import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { BlogUserService } from "./blog-user.service";
import { fillObject } from "@project/util/util-core";
import { UserRdo } from "./rdo/user.rdo";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import {
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse, ApiCreatedResponse
} from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { MongoidValidationPipe } from "@project/shared/shared-pipes";

@ApiTags('Users')
@Controller('users')
export class BlogUserController {
  constructor(
    private readonly blogUserService: BlogUserService,
  ) {
  }

  @ApiOkResponse({
    type: UserRdo,
    description: 'User has been successfully retrieved.'
  })
  @ApiNotFoundResponse({
    description: 'User not found'
  })
  @Get(':id')
  public async getUserById(@Param('id', MongoidValidationPipe) id: string): Promise<UserRdo> {
    const user = await this.blogUserService.getUser(id);
    return fillObject(UserRdo, user);
  }

  @ApiCreatedResponse({
    type: UserRdo,
    description: 'User has been successfully registered.'
  })
  @ApiConflictResponse({
    status: HttpStatus.CONFLICT,
    description: 'User with this email already exists'
  })
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() dto: CreateUserDto): Promise<UserRdo> {
    const newUser = await this.blogUserService.registerUser(dto)
    return fillObject(UserRdo, newUser);
  }

  @ApiOkResponse({
    description: 'Password has been successfully updated'
  })
  @ApiConflictResponse({
    description: 'Old password is incorrect'
  })
  @ApiNotFoundResponse({
    description: 'User not found'
  })
  @Post(':id/change-password')
  @HttpCode(HttpStatus.OK)
  public async changePassword(@Body() dto: UpdatePasswordDto, @Param('id', MongoidValidationPipe) id: string) {
    await this.blogUserService.updatePassword(id, dto);
    return undefined;
  }
}
