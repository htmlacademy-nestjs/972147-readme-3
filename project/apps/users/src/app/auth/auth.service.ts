import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { BlogUserMemoryRepository } from "../blog-user/repository/blog-user.memory-repository";
import { LoginUserDto } from "./dto/login-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { BlogUserEntity } from "../blog-user/blog-user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly blogUserRepository: BlogUserMemoryRepository,
  ) {
  }

  public async registerUser(dto: CreateUserDto) {
    const existUser = await this.blogUserRepository.findByEmail(dto.email);
    if (existUser) {
      throw new ConflictException();
    }
    const userEntity = BlogUserEntity.create({
      id: '',
      registeredAt: new Date(),
      postsCount: 0,
      subscribersCount: 0,
      passwordHash: '',
      email: dto.email,
      firstName: dto.lastName,
      avatar: dto.avatar,
      lastName: dto.lastName
    });

    await userEntity.setPassword(dto.password);
    return await this.blogUserRepository.create(userEntity);
  }

  public async validateUser(dto: LoginUserDto) {
    const {email, password} = dto;
    const existUser = await this.blogUserRepository.findByEmail(email);

    if (!existUser) {
      throw new UnauthorizedException();
    }

    const blogUserEntity = BlogUserEntity.create(existUser);
    if (!await blogUserEntity.checkPassword(password)) {
      throw new UnauthorizedException();
    }

    return blogUserEntity.toObject();
  }
}
