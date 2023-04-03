import { CrudRepository } from '@project/util/util-types';
import { CreateUserDto } from "../../auth/dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { BlogUserEntity } from "../blog-user.entity";

export type BlogUserRepository = CrudRepository<string, BlogUserEntity, CreateUserDto, UpdateUserDto & { id: string }>;
