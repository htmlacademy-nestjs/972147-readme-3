import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { BlogUserService } from "./blog-user.service";
import { fillObject } from "@project/util/util-core";
import { UserRdo } from "./rdo/user.rdo";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { ApiTags, ApiResponse } from "@nestjs/swagger";

@ApiTags('Users')
@Controller('users')
export class BlogUserController {
  constructor(
    private readonly blogUserService: BlogUserService,
  ) {
  }

  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.OK,
    description: 'User has been successfully retrieved.'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found'
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async getUserById(@Param('id') id: string): Promise<UserRdo> {
    const user = await this.blogUserService.getUser(id);
    return fillObject(UserRdo, user);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password has been successfully updated'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Old password is incorrect'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found'
  })
  @Post(':id/change-password')
  @HttpCode(HttpStatus.OK)
  public async changePassword(@Body() dto: UpdatePasswordDto, @Param('id') id: string) {
    await this.blogUserService.updatePassword(id, dto);
    return undefined;
  }
}
