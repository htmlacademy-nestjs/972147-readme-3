import { PostImage as DBPostImage } from "@prisma/client";
import { PostMetadata } from "@prisma/client";
import { PostImage, PostTypeEnum } from "@project/shared/app-types";
import { dbPostMetadataToPost } from "./mappers";
import { BlogPostRepository } from "../blog-post.repository.interface";
import { PrismaService } from "../../../prisma/prisma.service";
import { ImagePostDto } from "../../dto";

export class BlogPostDbImageRepository implements BlogPostRepository<PostTypeEnum.IMAGE> {
  constructor(private readonly prisma: PrismaService) {
  }

  private mapPostFromDb({id, imageUrl}: DBPostImage, metadata: PostMetadata): PostImage {
    return {id, imageUrl, type: PostTypeEnum.IMAGE, ...dbPostMetadataToPost(metadata)}
  }

  public async create(dto: ImagePostDto): Promise<PostImage> {
    const dbPost = await this.prisma.postImage.create({
      data: {
        ...dto,
        metadata: {
          create: {}
        }
      },
      include: {
        metadata: true
      }
    });
    return this.mapPostFromDb(dbPost, dbPost.metadata);
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.postImage.delete({
      where: {
        id,
      }
    });
  }

  public async get(id: string): Promise<PostImage | null> {
    const post = await this.prisma.postImage.findFirst({where: {id}, include: {metadata: true}});
    if (!post) {
      return null;
    }
    return this.mapPostFromDb(post, post.metadata);
  }

  public async list(ids: string[] = []): Promise<PostImage[]> {
    const dbPosts = await this.prisma.postImage.findMany({
      where: {
        id: {
          in: ids.length > 0 ? ids : undefined
        }
      },
      include: {
        metadata: true
      }
    });

    return dbPosts.map(dbPost => this.mapPostFromDb(dbPost, dbPost.metadata));
  }

  public async update(id: string, dto: ImagePostDto): Promise<PostImage> {
    const dbPost = await this.prisma.postImage.update({
      where: {
        id
      },
      data: {...dto},
      include: {
        metadata: true
      }
    });

    return this.mapPostFromDb(dbPost, dbPost.metadata);
  }
}
