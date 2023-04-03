import { CreateUserDto } from '../../auth/dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { BlogUserRepository } from "./blog-user.repository";
import { ApiResult } from "@project/util/util-types";
import { Ok, Err } from 'oxide.ts';
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { BlogUserEntity } from "../blog-user.entity";
import { fillObject } from "@project/util/util-core";
import { randomUUID } from 'node:crypto';
import { plainToInstance } from "class-transformer";

@Injectable()
export class BlogUserMemoryRepository implements BlogUserRepository {
  private repository: Record<string, BlogUserEntity> = {};

  public async create(dto: CreateUserDto): ApiResult<BlogUserEntity> {
    const existedUser = await this.findByEmail(dto.email);
    if (existedUser.isOk()) {
      return Err(new ConflictException());
    }

    const entity = BlogUserEntity.create({
      ...dto,
      id: randomUUID(),
      registeredAt: new Date(),
      postsCount: 0,
      subscribersCount: 0
    });
    await entity.setPassword(dto.password);

    this.repository[entity.id] = entity;
    return Ok(entity);
  }

  private _get(id: string): BlogUserEntity | undefined {
    return this.repository[id];
  }

  public async get(id: string): ApiResult<BlogUserEntity> {
    const existUser = this._get(id);

    if (existUser) {
      return Ok(existUser);
    }
    return Err(new NotFoundException());
  }

  public async findByEmail(email: string): ApiResult<BlogUserEntity> {
    const existUser = Object.values(this.repository)
      .find((userItem) => userItem.email === email);

    if (!existUser) {
      return Err(new NotFoundException())
    }

    return Ok(existUser);
  }

  public async delete(id: string): ApiResult<void> {
    delete this.repository[id];
    return Ok(undefined);
  }

  public async update(dto: UpdateUserDto & { id: string }): ApiResult<BlogUserEntity> {
    const existUser = this._get(dto.id);
    if (!existUser) {
      return Err(new NotFoundException());
    }

    const updatedUser = plainToInstance(BlogUserEntity, {...existUser, ...dto});
    this.repository[updatedUser.id] = updatedUser;
    return Ok(updatedUser);
  }
}
