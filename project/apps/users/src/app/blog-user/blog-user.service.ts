import { ConflictException, Injectable } from '@nestjs/common';
import { BlogUserMemoryRepository } from "./repository/blog-user.memory-repository";
import { match } from "oxide.ts";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class BlogUserService {
  constructor(
    private readonly blogUserRepository: BlogUserMemoryRepository,
  ) {
  }

  public async updatePassword(id: string, dto: UpdatePasswordDto) {
    const {oldPassword, newPassword} = dto;
    const res = await this.blogUserRepository.get(id);
    return match(res, {
      Ok: async (user) => {
        const isPasswordCorrect = await user.checkPassword(oldPassword);
        if (!isPasswordCorrect) {
          throw new ConflictException('Old password is incorrect');
        }
        await user.setPassword(newPassword);
      },
      Err: (e) => {
        throw e;
      }
    });
  }

  public async updateUser(id: string, dto: UpdateUserDto) {
    const res = await this.blogUserRepository.update({...dto, id});
    return match(res, {
      Ok: (user) => user,
      Err: (e) => {
        throw e
      },
    });
  }

  public async getUser(id: string) {
    const res = await this.blogUserRepository.get(id);
    return match(res, {
      Ok: (user) => user,
      Err: (e) => {
        throw e
      },
    });
  }
}
