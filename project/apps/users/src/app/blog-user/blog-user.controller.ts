import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BlogUserService } from "./blog-user.service";
import { fillObject } from "@project/util/util-core";
import { UserRdo } from "./rdo/user.rdo";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";

@Controller('users')
export class BlogUserController {
  constructor(
    private readonly blogUserService: BlogUserService,
  ) {
  }

  @Get(':id')
  public async getUserById(@Param('id') id: string) {
    const user = await this.blogUserService.getUser(id);
    return fillObject(UserRdo, user);
  }

  @Post(':id/update')
  public async update(@Body() dto: UpdateUserDto, @Param('id') id: string) {
    const user = await this.blogUserService.updateUser(id, dto);
    return fillObject(UserRdo, user);
  }

  @Post(':id/update-password')
  public async updatePassword(@Body() dto: UpdatePasswordDto, @Param('id') id: string) {
    await this.blogUserService.updatePassword(id, dto);
    return undefined;
  }
}
