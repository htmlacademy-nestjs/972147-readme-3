import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from "./dto/login-user.dto";
import { BlogUserEntity } from "../blog-user/blog-user.entity";
import { BlogUserDbRepository } from "../blog-user/repository/blog-user.db-repository";

@Injectable()
export class AuthService {
  constructor(
    private readonly blogUserRepository: BlogUserDbRepository,
  ) {
  }

  public async validateUser(dto: LoginUserDto) {
    const {email, password} = dto;
    const existUser = await this.blogUserRepository.findByEmail(email);

    if (!existUser) {
      throw new UnauthorizedException();
    }

    const blogUserEntity = new BlogUserEntity(existUser);
    if (!await blogUserEntity.checkPassword(password)) {
      throw new UnauthorizedException();
    }

    return blogUserEntity.toObject();
  }
}
