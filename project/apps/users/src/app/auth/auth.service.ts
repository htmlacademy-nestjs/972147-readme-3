import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { BlogUserEntity } from '../blog-user/blog-user.entity';
import { BlogUserDbRepository } from '../blog-user/repository/blog-user.db-repository';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload, User } from '@project/shared/app-types';
import { JwtAccessStrategy } from "./strategies/jwt-access.strategy";

@Injectable()
export class AuthService {
  constructor(
    private readonly blogUserRepository: BlogUserDbRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly jwtAccessStrategy: JwtAccessStrategy,
  ) {}

  public async validateUser(dto: LoginUserDto) {
    const { email, password } = dto;
    const existUser = await this.blogUserRepository.findByEmail(email);
    if (!existUser) {
      throw new UnauthorizedException();
    }
    const blogUserEntity = new BlogUserEntity(existUser);
    if (!(await blogUserEntity.checkPassword(password))) {
      throw new UnauthorizedException();
    }

    return blogUserEntity.toObject();
  }

  public async createUserToken(user: User) {
    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: ''
    };
  }
}
