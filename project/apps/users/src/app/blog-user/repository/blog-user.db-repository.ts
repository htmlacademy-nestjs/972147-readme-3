import { BlogUserRepositoryInterface } from "./blog-user.repository.interface";
import { User } from "@project/shared/app-types";
import { BlogUserEntity } from "../blog-user.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { BlogUserModel } from "../blog-user.model";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class BlogUserDbRepository implements BlogUserRepositoryInterface {
  constructor(
    @InjectModel(BlogUserModel.name) private readonly blogUserModel: Model<BlogUserModel>) {
  }

  public async get(id: string): Promise<User | null> {
    return this.blogUserModel.findById(id).exec();
  }

  public async create(entity: BlogUserEntity): Promise<User> {
    const newBlogUser = new this.blogUserModel(entity);
    return newBlogUser.save();
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.blogUserModel
      .findOne({email})
      .exec();
  }

  public async delete(id: string): Promise<void> {
    await this.blogUserModel.deleteOne({_id: id}).exec();
  }

  public async update(id: string, entity: BlogUserEntity): Promise<User> {
    const userModel = await this.blogUserModel.findByIdAndUpdate(id, entity.toObject(), {new: true});
    if (!userModel) {
      throw new NotFoundException()
    }
    return userModel;
  }
}
