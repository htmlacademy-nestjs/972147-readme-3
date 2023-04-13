import { PostVideo as DBPostVideo } from "@prisma/client";
import { PostMetadata } from "@prisma/client";
import { PostVideo, PostTypeEnum } from "@project/shared/app-types";
import { dbPostMetadataToPost } from "./mappers";
import { BlogPostRepository } from "../blog-post.repository.interface";
import { PrismaService } from "../../../prisma/prisma.service";
import { VideoPostDto } from "../../dto";

export class BlogPostDbVideoRepository implements BlogPostRepository<PostTypeEnum.VIDEO> {
  constructor(private readonly prisma: PrismaService) {
  }

  private mapPostFromDb({id, name, linkUrl}: DBPostVideo, metadata: PostMetadata): PostVideo {
    return {id, link: linkUrl, name, type: PostTypeEnum.VIDEO, ...dbPostMetadataToPost(metadata)}
  }

  public async create(dto: VideoPostDto): Promise<PostVideo> {
    const dbPost = await this.prisma.postVideo.create({
      data: {
        ...dto,
        linkUrl: dto.link,
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
    await this.prisma.postVideo.delete({
      where: {
        id,
      }
    });
  }

  public async get(id: string): Promise<PostVideo | null> {
    const dbPost = await this.prisma.postVideo.findFirst({where: {id}, include: {metadata: true}});
    if (!dbPost) {
      return null;
    }
    return this.mapPostFromDb(dbPost, dbPost.metadata);
  }

  public async list(ids: string[] = []): Promise<PostVideo[]> {
    const dbPosts = await this.prisma.postVideo.findMany({
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

  public async update(id: string, dto: VideoPostDto): Promise<PostVideo> {
    const dbPost = await this.prisma.postVideo.update({
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
