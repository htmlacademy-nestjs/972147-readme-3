import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { BlogUserMemoryRepository } from "./repository/blog-user.memory-repository";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { BlogUserEntity } from "./blog-user.entity";

@Injectable()
export class BlogUserService {
  constructor(
    private readonly blogUserRepository: BlogUserMemoryRepository,
  ) {
  }

  public async updatePassword(id: string, dto: UpdatePasswordDto) {
    const {oldPassword, newPassword} = dto;
    const existUser = await this.blogUserRepository.get(id);
    if (!existUser) {
      throw new NotFoundException('User not found');
    }
    const userEntity = BlogUserEntity.create(existUser);
    if (!await userEntity.checkPassword(oldPassword)) {
      throw new ConflictException('Old password is incorrect');
    }

    await userEntity.setPassword(newPassword);
    return await this.blogUserRepository.update(id, userEntity);
  }

  public async getUser(id: string) {
    const user = await this.blogUserRepository.get(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
