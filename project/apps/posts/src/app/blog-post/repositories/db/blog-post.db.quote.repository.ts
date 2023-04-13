import { PostQuote as DBPostQuote } from "@prisma/client";
import { PostMetadata } from "@prisma/client";
import { PostQuote, PostTypeEnum } from "@project/shared/app-types";
import { dbPostMetadataToPost } from "./mappers";
import { BlogPostRepository } from "../blog-post.repository.interface";
import { PrismaService } from "../../../prisma/prisma.service";
import { QuotePostDto } from "../../dto";

export class BlogPostDbQuoteRepository implements BlogPostRepository<PostTypeEnum.QUOTE> {
  constructor(private readonly prisma: PrismaService) {
  }

  private mapPostFromDb({id, text, quoteAuthor}: DBPostQuote, metadata: PostMetadata): PostQuote {
    return {id, text, quoteAuthor, type: PostTypeEnum.QUOTE, ...dbPostMetadataToPost(metadata)}
  }

  public async create(dto: QuotePostDto): Promise<PostQuote> {
    const dbPost = await this.prisma.postQuote.create({
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
    await this.prisma.postQuote.delete({
      where: {
        id,
      }
    });
  }

  public async get(id: string): Promise<PostQuote | null> {
    const dbPost = await this.prisma.postQuote.findFirst({where: {id}, include: {metadata: true}});
    if (!dbPost) {
      return null;
    }
    return this.mapPostFromDb(dbPost, dbPost.metadata);
  }

  public async list(ids: string[] = []): Promise<PostQuote[]> {
    const dbPosts = await this.prisma.postQuote.findMany({
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

  public async update(id: string, dto: QuotePostDto): Promise<PostQuote> {
    const dbPost = await this.prisma.postQuote.update({
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
