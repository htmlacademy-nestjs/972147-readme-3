import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BlogUserMemoryRepository } from "../blog-user/repository/blog-user.memory-repository";
import { LoginUserDto } from "./dto/login-user.dto";
import { match } from "oxide.ts";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly blogUserRepository: BlogUserMemoryRepository,
  ) {
  }

  public async registerUser(dto: CreateUserDto) {
    const createdUser = await this.blogUserRepository.create(dto);
    return match(createdUser, {
      Ok: (user) => user.toObject(),
      Err: (err) => {
        throw err;
      }
    });
  }

  public async validateUser(dto: LoginUserDto) {
    const {email, password} = dto;
    const existUser = await this.blogUserRepository.findByEmail(email);

    return match(existUser, {
      Ok: async (user) => {
        const isPasswordValid = await user.checkPassword(password);
        if (!isPasswordValid) {
          throw new UnauthorizedException();
        }
        return user.toObject();
      },
      Err: () => {
        throw new UnauthorizedException();
      }
    });
  }
}
