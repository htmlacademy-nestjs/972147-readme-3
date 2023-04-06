import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { BlogUserService } from "./blog-user.service";
import { fillObject } from "@project/util/util-core";
import { UserRdo } from "./rdo/user.rdo";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import {
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse
} from "@nestjs/swagger";

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
  public async getUserById(@Param('id') id: string): Promise<UserRdo> {
    const user = await this.blogUserService.getUser(id);
    return fillObject(UserRdo, user);
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
  public async changePassword(@Body() dto: UpdatePasswordDto, @Param('id') id: string) {
    await this.blogUserService.updatePassword(id, dto);
    return undefined;
  }
}
