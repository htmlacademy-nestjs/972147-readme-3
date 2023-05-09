import { Post, PostGeneric, PostImage, PostLink, PostQuote, PostStatusEnum, PostText, PostTypeEnum, PostUnion, PostVideo } from '@project/shared/app-types';
import { BlogPostRepository } from './blog-post.repository.interface';
import { BlogPostDtoGeneric } from '../dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Post as DBPost,
  PostImage as DBPostImage,
  PostLink as DBPostLink,
  PostQuote as DBPostQuote,
  PostStatus as DBPostStatus,
  PostText as DBPostText, PostType,
  PostType as DBPostType,
  PostVideo as DBPostVideo,
  Tag as DBTag
} from "@prisma/client";
import { BlogPostQuery } from '../query/blog-post.query';
import { CreateRepostDto } from '../dto/create-repost.dto';

type Nullable<T> = T | null;

type DBPostWithJoin = DBPost & {
  _count: {
    likes: number;
    comments: number;
  };
  tags: DBTag[];
};

type DBPostWithPostData = DBPostWithJoin & {
  postImage: Nullable<DBPostImage>;
  postVideo: Nullable<DBPostVideo>;
  postQuote: Nullable<DBPostQuote>;
  postText: Nullable<DBPostText>;
  postLink: Nullable<DBPostLink>;
};

@Injectable()
export class BlogPostDbRepository implements BlogPostRepository {
  constructor(private prisma: PrismaService) {}

  private getIncludedPosts(type?: PostTypeEnum) {
    return {
      postImage: type === undefined || type === PostTypeEnum.IMAGE,
      postText: type === undefined || type === PostTypeEnum.TEXT,
      postVideo: type === undefined || type === PostTypeEnum.VIDEO,
      postLink: type === undefined || type === PostTypeEnum.LINK,
      postQuote: type === undefined || type === PostTypeEnum.QUOTE,
    };
  }

  private getIncludedCount() {
    return {
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    };
  }

  private mapDBPostStatusToPostStatus(status: DBPostStatus): PostStatusEnum {
    switch (status) {
      case DBPostStatus.DRAFT:
        return PostStatusEnum.DRAFT;
      case DBPostStatus.PUBLISHED:
        return PostStatusEnum.PUBLISHED;
      default:
        throw new Error(`Unknown DBPostStatus: ${status}`);
    }
  }

  private mapPostStatusToDBPostStatus(status: PostStatusEnum): DBPostStatus {
    switch (status) {
      case PostStatusEnum.DRAFT:
        return DBPostStatus.DRAFT;
      case PostStatusEnum.PUBLISHED:
        return DBPostStatus.PUBLISHED;
      default:
        throw new Error(`Unknown DBPostStatus: ${status}`);
    }
  }

  private mapDBPostTypeToPostType(type: DBPostType): PostTypeEnum {
    switch (type) {
      case DBPostType.IMAGE:
        return PostTypeEnum.IMAGE;
      case DBPostType.TEXT:
        return PostTypeEnum.TEXT;
      case DBPostType.VIDEO:
        return PostTypeEnum.VIDEO;
      case DBPostType.LINK:
        return PostTypeEnum.LINK;
      case DBPostType.QUOTE:
        return PostTypeEnum.QUOTE;
      default:
        throw new Error(`Unknown DBPostType: ${type}`);
    }
  }

  private mapPostTypeToDBPostType(type: PostTypeEnum): DBPostType {
    switch (type) {
      case PostTypeEnum.IMAGE:
        return DBPostType.IMAGE;
      case PostTypeEnum.TEXT:
        return DBPostType.TEXT;
      case PostTypeEnum.VIDEO:
        return DBPostType.VIDEO;
      case PostTypeEnum.LINK:
        return DBPostType.LINK;
      case PostTypeEnum.QUOTE:
        return DBPostType.QUOTE;
      default:
        throw new Error(`Unknown post type: ${type}`);
    }
  }

  private mapDBPostToPost(dbPost: DBPostWithJoin): Omit<Post, 'type'> {
    return {
      id: dbPost.id,
      isRepost: dbPost.isRepost,
      createdAt: dbPost.createdAt,
      updatedAt: dbPost.updatedAt,
      authorId: dbPost.authorId,
      publishedAt: dbPost.publishedAt,
      status: this.mapDBPostStatusToPostStatus(dbPost.status),
      originalAuthorId: dbPost.originalAuthorId ? dbPost.originalAuthorId : undefined,
      likesCount: dbPost._count.likes,
      commentsCount: dbPost._count.comments,
      tags: dbPost.tags.map((t) => t.name),
    };
  }

  private mapDBPostImageToPostImage(dbPost: DBPostWithJoin, dbPostImage: Omit<DBPostImage, 'id'>): PostImage {
    return {
      ...this.mapDBPostToPost(dbPost),
      type: PostTypeEnum.IMAGE,
      imageFileId: dbPostImage.imageFileId,
    };
  }

  private mapDBPostTextToPostText(dbPost: DBPostWithJoin, dbPostText: Omit<DBPostText, 'id'>): PostText {
    return {
      ...this.mapDBPostToPost(dbPost),
      announceText: dbPostText.announceText,
      name: dbPostText.name,
      mainText: dbPostText.mainText,
      type: PostTypeEnum.TEXT,
    };
  }

  private mapDBPostQuoteToPostQuote(dbPost: DBPostWithJoin, dbPostQuote: Omit<DBPostQuote, 'id'>): PostQuote {
    return {
      ...this.mapDBPostToPost(dbPost),
      quoteAuthor: dbPostQuote.quoteAuthor,
      text: dbPostQuote.text,
      type: PostTypeEnum.QUOTE,
    };
  }

  private mapDBPostLinkToPostLink(dbPost: DBPostWithJoin, dbPostLink: Omit<DBPostLink, 'id'>): PostLink {
    return {
      ...this.mapDBPostToPost(dbPost),
      linkUrl: dbPostLink.linkUrl,
      description: dbPostLink.description ? dbPostLink.description : undefined,
      type: PostTypeEnum.LINK,
    };
  }

  private mapDBPostVideoToPostVideo(dbPost: DBPostWithJoin, dbPostLink: Omit<DBPostVideo, 'id'>): PostVideo {
    return {
      ...this.mapDBPostToPost(dbPost),
      linkUrl: dbPostLink.linkUrl,
      name: dbPostLink.name,
      type: PostTypeEnum.VIDEO,
    };
  }

  private mapDBPostWithPostToPostUnion(dbPost: DBPostWithPostData): PostUnion {
    if (dbPost.postImage) {
      return this.mapDBPostImageToPostImage(dbPost, dbPost.postImage);
    }

    if (dbPost.postText) {
      return this.mapDBPostTextToPostText(dbPost, dbPost.postText);
    }

    if (dbPost.postQuote) {
      return this.mapDBPostQuoteToPostQuote(dbPost, dbPost.postQuote);
    }

    if (dbPost.postLink) {
      return this.mapDBPostLinkToPostLink(dbPost, dbPost.postLink);
    }

    if (dbPost.postVideo) {
      return this.mapDBPostVideoToPostVideo(dbPost, dbPost.postVideo);
    }

    throw new Error(`Unknown post type for post with id: ${dbPost.id}`);
  }

  private prepareDbPostSchema<T extends PostTypeEnum>(dto: BlogPostDtoGeneric<T>, type: 'create' | 'update') {
    return {
      postImage: dto.type === PostTypeEnum.IMAGE ? { [type]: { imageFileId: dto.imageFileId } } : undefined,
      postText: dto.type === PostTypeEnum.TEXT ? { [type]: { name: dto.name, announceText: dto.announceText, mainText: dto.mainText } } : undefined,
      postQuote: dto.type === PostTypeEnum.QUOTE ? { [type]: { quoteAuthor: dto.quoteAuthor, text: dto.text } } : undefined,
      postLink: dto.type === PostTypeEnum.LINK ? { [type]: { linkUrl: dto.linkUrl, description: dto.description } } : undefined,
      postVideo: dto.type === PostTypeEnum.VIDEO ? { [type]: { linkUrl: dto.linkUrl, name: dto.name } } : undefined,
    };
  }

  public async get(id: string): Promise<PostUnion | null> {
    const dbPost = await this.prisma.post.findFirst({
      where: { id },
      include: {
        tags: true,
        ...this.getIncludedPosts(),
        ...this.getIncludedCount(),
      },
    });

    if (!dbPost) {
      return null;
    }

    return this.mapDBPostWithPostToPostUnion(dbPost);
  }

  public async list(query: BlogPostQuery): Promise<PostUnion[]> {
    const { sortBy, sortDirection, page, type, limit, authorIds, search } = query;
    const postSearchParams = (queryType: PostTypeEnum) => {
      if (!search) {
        return undefined;
      }
      if (!type) {
        return {
          name: { search },
        };
      }
      if (type === queryType) {
        return {
          name: { search },
        };
      }
      return undefined;
    }
    const dbPosts = await this.prisma.post.findMany({
      where: {
        type: type
          ? {
              equals: this.mapPostTypeToDBPostType(type),
            }
          : undefined,
        postVideo: postSearchParams(PostTypeEnum.VIDEO),
        postText: postSearchParams(PostTypeEnum.TEXT),
        status: DBPostStatus.PUBLISHED,
        authorId: authorIds ? { in: authorIds } : undefined,
      },
      orderBy: {
        publishedAt: sortBy === 'published' ? sortDirection : undefined,
        likes:
          sortBy === 'likes'
            ? {
                _count: sortDirection,
              }
            : undefined,
        comments:
          sortBy === 'comments'
            ? {
                _count: sortDirection,
              }
            : undefined,
      },
      include: {
        tags: true,
        ...this.getIncludedPosts(type),
        ...this.getIncludedCount(),
      },
      take: limit,
      skip: page > 0 ? limit * (page - 1) : undefined,
    });

    return dbPosts.map((dbPost) => this.mapDBPostWithPostToPostUnion(dbPost));
  }

  public async create<T extends PostTypeEnum>(dto: BlogPostDtoGeneric<T>): Promise<PostGeneric<T>> {
    const tags = dto.tags ? [...new Set(dto.tags)] : [];
    const dbPost = await this.prisma.post.create({
      data: {
        authorId: dto.authorId,
        publishedAt: dto.publishedAt,
        type: this.mapPostTypeToDBPostType(dto.type),
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
        status: dto.status ? this.mapPostStatusToDBPostStatus(dto.status) : DBPostStatus.PUBLISHED,
        ...this.prepareDbPostSchema(dto, 'create'),
      },
      include: {
        tags: true,
        ...this.getIncludedPosts(dto.type),
        ...this.getIncludedCount(),
      },
    });

    return this.mapDBPostWithPostToPostUnion(dbPost) as unknown as Promise<PostGeneric<T>>;
  }

  public async delete(id: string): Promise<void> {
    const dbPost = await this.prisma.post.findFirst({ where: { id } });
    if (!dbPost) {
      throw new Error(`Post with id ${id} not found`);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.post.delete({ where: { id: dbPost.id } });
      if (dbPost.postImageId) {
        await tx.postImage.delete({ where: { id: dbPost.postImageId } });
      }
      if (dbPost.postLinkId) {
        await tx.postLink.delete({ where: { id: dbPost.postLinkId } });
      }
      if (dbPost.postQuoteId) {
        await tx.postQuote.delete({ where: { id: dbPost.postQuoteId } });
      }
      if (dbPost.postTextId) {
        await tx.postText.delete({ where: { id: dbPost.postTextId } });
      }
      if (dbPost.postVideoId) {
        await tx.postVideo.delete({ where: { id: dbPost.postVideoId } });
      }
    });
  }

  public async update<T extends PostTypeEnum>(id: string, dto: BlogPostDtoGeneric<T>): Promise<PostGeneric<T>> {
    const tags = dto.tags ? [...new Set(dto.tags)] : [];
    const currentPost = await this.get(id);
    const dbPost = await this.prisma.post.update({
      where: { id },
      data: {
        publishedAt: dto.publishedAt,
        tags: {
          disconnect: currentPost?.tags?.map((tag) => ({ name: tag })),
          connectOrCreate: tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
        status: dto.status ? this.mapPostStatusToDBPostStatus(dto.status) : undefined,
        ...this.prepareDbPostSchema(dto, 'update'),
      },
      include: {
        tags: true,
        ...this.getIncludedPosts(dto.type),
        ...this.getIncludedCount(),
      },
    });

    return this.mapDBPostWithPostToPostUnion(dbPost) as unknown as Promise<PostGeneric<T>>;
  }

  public async createRepost(dto: CreateRepostDto): Promise<PostUnion> {
    const { postId, authorId } = dto;
    const dbPost = await this.prisma.post.findFirst({
      where: { id: postId },
      include: {
        tags: true,
        ...this.getIncludedPosts(),
        ...this.getIncludedCount(),
      },
    });

    if (!dbPost) {
      throw new NotFoundException();
    }

    if (dbPost.isRepost) {
      throw new BadRequestException('Repost can not be reposted');
    }

    const repost = await this.prisma.post.create({
      data: {
        authorId,
        originalAuthorId: dbPost.authorId,
        isRepost: true,
        publishedAt: new Date(),
        type: dbPost.type,
        tags: {
          connectOrCreate: dbPost.tags.map((tag) => ({
            where: { name: tag.name },
            create: { name: tag.name },
          })),
        },
        status: DBPostStatus.PUBLISHED,
        postQuote: dbPost.postQuote ? { create: { ...dbPost.postQuote, id: undefined } } : undefined,
        postImage: dbPost.postImage ? { create: { ...dbPost.postImage, id: undefined } } : undefined,
        postText: dbPost.postText ? { create: { ...dbPost.postText, id: undefined } } : undefined,
        postVideo: dbPost.postVideo ? { create: { ...dbPost.postVideo, id: undefined } } : undefined,
        postLink: dbPost.postLink ? { create: { ...dbPost.postLink, id: undefined } } : undefined,
      },
      include: {
        tags: true,
        ...this.getIncludedPosts(),
        ...this.getIncludedCount(),
      },
    });

    return this.mapDBPostWithPostToPostUnion(repost);
  }

  public async getCountByAuthorId(authorId: string): Promise<number> {
    return this.prisma.post.count({ where: { authorId, status: DBPostStatus.PUBLISHED } });
  }
}
