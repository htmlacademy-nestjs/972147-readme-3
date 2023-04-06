import { Injectable } from "@nestjs/common";
import { BlogUserEntity } from "../blog-user.entity";
import { User } from "@project/shared/app-types";
import { randomUUID } from 'node:crypto';
import { BlogUserRepositoryInterface } from "./blog-user.repository.interface";

@Injectable()
export class BlogUserMemoryRepository implements BlogUserRepositoryInterface {
  private repository: Record<string, User> = {};

  public async get(id: string): Promise<User | null> {
    if (this.repository[id]) {
      return {...this.repository[id]};
    }

    return null;
  }

  public async create(entity: BlogUserEntity): Promise<User> {
    const entry = {...entity.toObject(), id: randomUUID()};
    this.repository[entry.id] = entry;

    return {...entry};
  }

  public async findByEmail(email: string): Promise<User | null> {
    const existUser = Object.values(this.repository)
      .find((userItem) => userItem.email === email);

    if (!existUser) {
      return null;
    }

    return {...existUser};
  }

  public async delete(id: string): Promise<void> {
    delete this.repository[id];
  }

  public async update(id: string, entity: BlogUserEntity): Promise<User> {
    this.repository[id] = {...entity.toObject(), id: id};
    return {...this.repository[id]};
  }
}
