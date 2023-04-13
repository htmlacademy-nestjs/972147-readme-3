import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fillDb() {
  await prisma.postImage.upsert({
    where: {id: ''},
    update: {},
    create: {
      imageUrl: 'https://picsum.photos/200/300',
      metadata: {
        create: {}
      }
    }
  });
  await prisma.postText.upsert({
    where: {id: ''},
    update: {},
    create: {
      name: 'Hello world',
      announceText: 'Hello world',
      mainText: 'Hello world',
      metadata: {
        create: {}
      }
    }
  });
  await prisma.postLink.upsert({
    where: {id: ''},
    update: {},
    create: {
      linkUrl: 'https://google.com',
      description: 'Google',
      metadata: {
        create: {}
      }
    }
  });
  await prisma.postVideo.upsert({
    where: {id: ''},
    update: {},
    create: {
      linkUrl: 'https://www.youtube.com/watch?v=QH2-TGUlwu4',
      name: 'Funny video',
      metadata: {
        create: {}
      }
    }
  });
  await prisma.postQuote.upsert({
    where: {id: ''},
    update: {},
    create: {
      quoteAuthor: 'John Doe',
      text: 'Hello world',
      metadata: {
        create: {}
      }
    }
  });
  console.info('🤘️ Database was filled')
}

fillDb()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect()

    process.exit(1);
  });
