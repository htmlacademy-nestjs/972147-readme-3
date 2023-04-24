import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { BlogUserEntity } from "./blog-user.entity";
import { BlogUserDbRepository } from "./repository/blog-user.db-repository";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class BlogUserService {
  constructor(
    private readonly blogUserRepository: BlogUserDbRepository,
  ) {
  }

  public async updatePassword(id: string, dto: UpdatePasswordDto) {
    const { oldPassword, newPassword } = dto;
    const existUser = await this.blogUserRepository.get(id);
    if (!existUser) {
      throw new NotFoundException('User not found');
    }
    const userEntity = new BlogUserEntity(existUser);
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
    await this.blogUserRepository.delete(id);

    return user;
  }

  public async registerUser(dto: CreateUserDto) {
    const existUser = await this.blogUserRepository.findByEmail(dto.email);
    if (existUser) {
      throw new ConflictException();
    }
    const userEntity = new BlogUserEntity({
      id: '',
      registeredAt: new Date(),
      postsCount: 0,
      subscribersCount: 0,
      passwordHash: '',
      email: dto.email,
      firstName: dto.lastName,
      avatarFileId: dto.avatarFileId,
      lastName: dto.lastName
    });

    await userEntity.setPassword(dto.password);
    return await this.blogUserRepository.create(userEntity);
  }
}
