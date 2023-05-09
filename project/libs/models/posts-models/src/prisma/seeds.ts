import { PrismaClient, PostType } from '@prisma/client';

const prisma = new PrismaClient();

const fakeAuthorId = 'fakeAuthorId';

async function fillDb() {
  await prisma.post.upsert({
    where: { id: '' },
    update: {},
    create: {
      authorId: fakeAuthorId,
      postImage: {
        create: {
          imageFileId: 'fakeImageFileId',
        },
      },
      type: PostType.IMAGE,
      comments: {
        create: [
          {
            authorId: fakeAuthorId,
            text: 'Comment image 1',
          },
          {
            authorId: fakeAuthorId,
            text: 'Comment image 2',
          },
        ],
      },
      tags: {
        connectOrCreate: [
          {
            where: { name: 'tag1' },
            create: { name: 'tag1' },
          },
          {
            where: { name: 'tag2' },
            create: { name: 'tag2' },
          },
        ],
      },
    },
  });
  await prisma.post.upsert({
    where: { id: '' },
    update: {},
    create: {
      authorId: fakeAuthorId,
      postLink: {
        create: {
          linkUrl: 'https://google.com',
          description: 'Google',
        },
      },
      type: PostType.LINK,
      comments: {
        create: [
          {
            authorId: fakeAuthorId,
            text: 'Comment link 1',
          },
          {
            authorId: fakeAuthorId,
            text: 'Comment link 2',
          },
        ],
      },
      tags: {
        connectOrCreate: [
          {
            where: { name: 'tag3' },
            create: { name: 'tag4' },
          },
          {
            where: { name: 'tag2' },
            create: { name: 'tag2' },
          },
        ],
      },
    },
  });
  await prisma.post.upsert({
    where: { id: '' },
    update: {},
    create: {
      authorId: fakeAuthorId,
      postText: {
        create: {
          announceText: 'Announce text',
          mainText: 'Full text',
          name: 'Post name',
        },
      },
      type: PostType.TEXT,
      comments: {
        create: [
          {
            authorId: fakeAuthorId,
            text: 'Comment text 1',
          },
          {
            authorId: fakeAuthorId,
            text: 'Comment text 2',
          },
        ],
      },
      tags: {
        connectOrCreate: [
          {
            where: { name: 'tag5' },
            create: { name: 'tag5' },
          },
          {
            where: { name: 'tag2' },
            create: { name: 'tag2' },
          },
        ],
      },
    },
  });
  await prisma.post.upsert({
    where: { id: '' },
    update: {},
    create: {
      authorId: fakeAuthorId,
      postVideo: {
        create: {
          linkUrl: 'https://www.youtube.com/watch?v=QH2-TGUlwu4',
          name: 'Funny video',
        },
      },
      type: PostType.VIDEO
    },
  });
  await prisma.post.upsert({
    where: { id: '' },
    update: {},
    create: {
      authorId: fakeAuthorId,
      postQuote: {
        create: {
          quoteAuthor: 'John Doe',
          text: 'Text',
        },
      },
      type: PostType.QUOTE
    },
  });
  console.info('🤘️ Database was filled');
}

fillDb()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();

    process.exit(1);
  });
