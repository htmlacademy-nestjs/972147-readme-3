import { Post, PostGeneric, PostImage, PostLink, PostQuote, PostStatusEnum, PostText, PostTypeEnum, PostUnion, PostVideo } from '@project/shared/app-types';
import { BlogPostRepository, ListBlogPostRepositoryParams, PostAuthor } from './blog-post.repository.interface';
import { BlogPostDtoGeneric } from '../dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Post as DBPost,
  PostImage as DBPostImage,
  PostLink as DBPostLink,
  PostQuote as DBPostQuote,
  PostStatus as DBPostStatus,
  PostText as DBPostText,
  PostVideo as DBPostVideo,
} from '@prisma/client';

type Nullable<T> = T | null;

type DBPostWithCountJoin = DBPost & {
  _count: {
    likes: number;
    comments: number;
  };
};

type DBPostWithPostData = DBPostWithCountJoin & {
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

  private mapDBPostToPost(dbPost: DBPostWithCountJoin): Omit<Post, 'type'> {
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
    };
  }

  private mapDBPostImageToPostImage(dbPost: DBPostWithCountJoin, dbPostImage: Omit<DBPostImage, 'id'>): PostImage {
    return {
      ...this.mapDBPostToPost(dbPost),
      type: PostTypeEnum.IMAGE,
      imageUrl: dbPostImage.imageUrl,
    };
  }

  private mapDBPostTextToPostText(dbPost: DBPostWithCountJoin, dbPostText: Omit<DBPostText, 'id'>): PostText {
    return {
      ...this.mapDBPostToPost(dbPost),
      announceText: dbPostText.announceText,
      name: dbPostText.name,
      mainText: dbPostText.mainText,
      type: PostTypeEnum.TEXT,
    };
  }

  private mapDBPostQuoteToPostQuote(dbPost: DBPostWithCountJoin, dbPostQuote: Omit<DBPostQuote, 'id'>): PostQuote {
    return {
      ...this.mapDBPostToPost(dbPost),
      quoteAuthor: dbPostQuote.quoteAuthor,
      text: dbPostQuote.text,
      type: PostTypeEnum.QUOTE,
    };
  }

  private mapDBPostLinkToPostLink(dbPost: DBPostWithCountJoin, dbPostLink: Omit<DBPostLink, 'id'>): PostLink {
    return {
      ...this.mapDBPostToPost(dbPost),
      link: dbPostLink.linkUrl,
      description: dbPostLink.description ? dbPostLink.description : undefined,
      type: PostTypeEnum.LINK,
    };
  }

  private mapDBPostVideoToPostVideo(dbPost: DBPostWithCountJoin, dbPostLink: Omit<DBPostVideo, 'id'>): PostVideo {
    return {
      ...this.mapDBPostToPost(dbPost),
      link: dbPostLink.linkUrl,
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
      postImage: dto.type === PostTypeEnum.IMAGE ? { [type]: { imageUrl: dto.imageUrl } } : undefined,
      postText: dto.type === PostTypeEnum.TEXT ? { [type]: { name: dto.name, announceText: dto.announceText, mainText: dto.mainText } } : undefined,
      postQuote: dto.type === PostTypeEnum.QUOTE ? { [type]: { quoteAuthor: dto.quoteAuthor, text: dto.text } } : undefined,
      postLink: dto.type === PostTypeEnum.LINK ? { [type]: { linkUrl: dto.link, description: dto.description } } : undefined,
      postVideo: dto.type === PostTypeEnum.VIDEO ? { [type]: { linkUrl: dto.link, name: dto.name } } : undefined,
    };
  }

  public async get(id: string): Promise<PostUnion | null> {
    const dbPost = await this.prisma.post.findFirst({
      where: { id },
      include: {
        ...this.getIncludedPosts(),
        ...this.getIncludedCount(),
      },
    });

    if (!dbPost) {
      return null;
    }

    return this.mapDBPostWithPostToPostUnion(dbPost);
  }

  public async list({ ids, type }: ListBlogPostRepositoryParams): Promise<PostUnion[]> {
    const dbPosts = await this.prisma.post.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        ...this.getIncludedPosts(type),
        ...this.getIncludedCount(),
      },
    });

    return dbPosts.map((dbPost) => this.mapDBPostWithPostToPostUnion(dbPost));
  }

  public async create<T extends PostTypeEnum>(dto: BlogPostDtoGeneric<T, PostAuthor>): Promise<PostGeneric<T>> {
    const dbPost = await this.prisma.post.create({
      data: {
        authorId: dto.authorId,
        publishedAt: dto.publishedAt,
        ...this.prepareDbPostSchema(dto, 'create'),
      },
      include: {
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
        ...this.prepareDbPostSchema(dto, 'update'),
      },
      include: {
        ...this.getIncludedPosts(dto.type),
        ...this.getIncludedCount(),
      },
    });

    return this.mapDBPostWithPostToPostUnion(dbPost) as unknown as Promise<PostGeneric<T>>;
  }
}
