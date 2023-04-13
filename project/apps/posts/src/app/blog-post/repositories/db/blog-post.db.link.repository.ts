import { PostLink as DBPostLink } from "@prisma/client";
import { PostMetadata } from "@prisma/client";
import { PostLink, PostTypeEnum } from "@project/shared/app-types";
import { dbPostMetadataToPost } from "./mappers";
import { BlogPostRepository } from "../blog-post.repository.interface";
import { PrismaService } from "../../../prisma/prisma.service";
import { LinkPostDto } from "../../dto";

export class BlogPostDbLinkRepository implements BlogPostRepository<PostTypeEnum.LINK> {
  constructor(private readonly prisma: PrismaService) {
  }

  private mapPostFromDb({id, linkUrl, description}: DBPostLink, metadata: PostMetadata): PostLink {
    return {
      id,
      link: linkUrl,
      description: description ? description : undefined,
      type: PostTypeEnum.LINK, ...dbPostMetadataToPost(metadata)
    }
  }

  public async create(dto: LinkPostDto): Promise<PostLink> {
    const dbPost = await this.prisma.postLink.create({
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
    await this.prisma.postLink.delete({
      where: {
        id,
      }
    });
  }

  public async get(id: string): Promise<PostLink | null> {
    const dbPost = await this.prisma.postLink.findFirst({where: {id}, include: {metadata: true}});
    if (!dbPost) {
      return null;
    }
    return this.mapPostFromDb(dbPost, dbPost.metadata);
  }

  public async list(ids: string[] = []): Promise<PostLink[]> {
    const dbPosts = await this.prisma.postLink.findMany({
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

  public async update(id: string, dto: LinkPostDto): Promise<PostLink> {
    const dbPost = await this.prisma.postLink.update({
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
