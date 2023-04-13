import { PostText as DBPostText } from "@prisma/client";
import { PostMetadata } from "@prisma/client";
import { PostText, PostTypeEnum } from "@project/shared/app-types";
import { dbPostMetadataToPost } from "./mappers";
import { BlogPostRepository } from "../blog-post.repository.interface";
import { PrismaService } from "../../../prisma/prisma.service";
import { TextPostDto } from "../../dto";

export class BlogPostDbTextRepository implements BlogPostRepository<PostTypeEnum.TEXT> {
  constructor(private readonly prisma: PrismaService) {
  }

  private mapPostFromDb({id, mainText, announceText, name}: DBPostText, metadata: PostMetadata): PostText {
    return {id, mainText, announceText, name, type: PostTypeEnum.TEXT, ...dbPostMetadataToPost(metadata)}
  }

  public async create(dto: TextPostDto): Promise<PostText> {
    const dbPost = await this.prisma.postText.create({
      data: {
        mainText: dto.mainText,
        announceText: dto.announceText,
        name: dto.name,
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
    return await this.prisma.$transaction(async (tx) => {
      const dbPost = await tx.postText.findFirst({where: {id}, include: {metadata: true}});
      if (!dbPost) {
        throw new Error(`Post with id ${id} not found`);
      }
      await tx.postText.delete({where: {id}});
      await tx.postMetadata.delete({where: {id: dbPost.metadata.id}});
    });
  }

  public async get(id: string): Promise<PostText | null> {
    const dbPost = await this.prisma.postText.findFirst({where: {id}, include: {metadata: true}});
    if (!dbPost) {
      return null;
    }
    return this.mapPostFromDb(dbPost, dbPost.metadata);
  }

  public async list(ids: string[] = []): Promise<PostText[]> {
    const dbPosts = await this.prisma.postText.findMany({
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

  public async update(id: string, dto: TextPostDto): Promise<PostText> {
    const dbPost = await this.prisma.postText.update({
      where: {
        id
      },
      data: {
        mainText: dto.mainText,
        announceText: dto.announceText,
        name: dto.name,
      },
      include: {
        metadata: true
      }
    });

    return this.mapPostFromDb(dbPost, dbPost.metadata);
  }
}
