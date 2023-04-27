import { PrismaClient } from '@prisma/client';

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
