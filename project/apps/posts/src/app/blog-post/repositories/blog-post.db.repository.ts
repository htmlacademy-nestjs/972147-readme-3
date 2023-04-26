import { Post, PostGeneric, PostImage, PostLink, PostQuote, PostStatusEnum, PostText, PostTypeEnum, PostUnion, PostVideo } from '@project/shared/app-types';
import { BlogPostRepository, PostAuthor } from './blog-post.repository.interface';
import { BlogPostDtoGeneric } from '../dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Post as DBPost,
  PostImage as DBPostImage,
  PostLink as DBPostLink,
  PostQuote as DBPostQuote,
  PostStatus as DBPostStatus,
  PostType as DBPostType,
  PostText as DBPostText,
  PostVideo as DBPostVideo,
  Tag as DBTag,
} from '@prisma/client';
import { BlogPostQuery } from "../query/blog-post.query";

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

  private mapPostTypeToDBPostType (type: PostTypeEnum): DBPostType {
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
    const {sortBy, sortDirection, page, type, limit, authorId} = query;
    const dbPosts = await this.prisma.post.findMany({
      where: {
        type: {
          equals: type ? this.mapPostTypeToDBPostType(type) : undefined,
        },
        status: DBPostStatus.PUBLISHED,
        authorId: authorId,
      },
      orderBy: {
        publishedAt: sortBy === 'published' ? sortDirection : undefined,
        likes: {
          _count: sortBy === 'likes' ? sortDirection : undefined,
        },
        comments: {
          _count: sortBy === 'comments' ? sortDirection : undefined,
        },
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

  public async create<T extends PostTypeEnum>(dto: BlogPostDtoGeneric<T, PostAuthor>): Promise<PostGeneric<T>> {
    const dbPost = await this.prisma.post.create({
      data: {
        authorId: dto.authorId,
        publishedAt: dto.publishedAt,
        type: this.mapPostTypeToDBPostType(dto.type),
        tags: {
          create: dto.tags ? dto.tags.map((tag) => ({ name: tag })) : [],
        },
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
      dbPost.postImageId && (await tx.postImage.delete({ where: { id: dbPost.postImageId } }));
      dbPost.postLinkId && (await tx.postLink.delete({ where: { id: dbPost.postLinkId } }));
      dbPost.postQuoteId && (await tx.postQuote.delete({ where: { id: dbPost.postQuoteId } }));
      dbPost.postTextId && (await tx.postText.delete({ where: { id: dbPost.postTextId } }));
      dbPost.postVideoId && (await tx.postVideo.delete({ where: { id: dbPost.postVideoId } }));
      await tx.post.delete({ where: { id } });
    });
  }

  public async update<T extends PostTypeEnum>(id: string, dto: BlogPostDtoGeneric<T>): Promise<PostGeneric<T>> {
    const dbPost = await this.prisma.post.update({
      where: { id },
      data: {
        publishedAt: dto.publishedAt,
        tags: {
          create: dto.tags ? dto.tags.map((tag) => ({ name: tag })) : [],
        },
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
}
