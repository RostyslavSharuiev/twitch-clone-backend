import { faker } from '@faker-js/faker';
import { BadRequestException, Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '@prisma/generated/client';
import { hash } from 'argon2';
import 'dotenv/config';

const CATEGORY_IMAGE_PATH_PREFIX = '/categories';
const CHANNEL_IMAGE_PATH_PREFIX = '/channels';
const STREAM_IMAGE_PATH_PREFIX = '/streams';
const MAX_RECORDS_TO_CREATE = 100;

const adapter = new PrismaPg({
  connectionString: process.env.POSTGRES_URI,
});

const prisma = new PrismaClient({
  adapter,
  transactionOptions: {
    maxWait: 5000,
    timeout: 10000,
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
  },
});

type CategoryRecord = {
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
};

type StreamTitleRecord = string[];

type UsernameRecord = string;

const generateCategoryDataList = (): CategoryRecord[] => {
  const categoryDataList: CategoryRecord[] = [];
  const slugsSet = new Set<string>();

  for (let i = 0; i < MAX_RECORDS_TO_CREATE; i++) {
    const baseTitle = faker.commerce.department();
    let title = baseTitle;
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (slugsSet.has(slug) || !slug) {
      title = `${baseTitle} ${i + 1}`;
      slug = `${slug || 'category'}-${i + 1}`;
    }

    slugsSet.add(slug);

    categoryDataList.push({
      title,
      slug,
      description: faker.lorem.paragraph(),
      thumbnailUrl: `${CATEGORY_IMAGE_PATH_PREFIX}/${slug}.webp`,
    });
  }

  return categoryDataList;
};

const generateStreamTitleList = (
  categories: { slug: string }[]
): Record<string, StreamTitleRecord> => {
  const streamTitleList: Record<string, StreamTitleRecord> = {};

  for (const category of categories) {
    const titles: string[] = [];

    for (let i = 0; i < MAX_RECORDS_TO_CREATE; i++) {
      titles.push(faker.lorem.sentence());
    }

    streamTitleList[category.slug] = titles;
  }

  return streamTitleList;
};

const generateUsernameList = (): UsernameRecord[] => {
  const usernameList: UsernameRecord[] = [];
  const usernamesSet = new Set<string>();

  for (let i = 0; i < MAX_RECORDS_TO_CREATE; i++) {
    const rawUsername = faker.internet.username();
    let username = rawUsername.toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (username.length < 3 || usernamesSet.has(username)) {
      username = `user_${i + 1}_${faker.string.alphanumeric(4)}`;
    }

    usernamesSet.add(username);
    usernameList.push(username);
  }

  return usernameList;
};

const main = async () => {
  try {
    Logger.log('Start to seed a DB');

    await prisma.$transaction([
      prisma.user.deleteMany(),
      prisma.socialLink.deleteMany(),
      prisma.stream.deleteMany(),
      prisma.category.deleteMany(),
    ]);

    const categoryDataList = generateCategoryDataList();

    await prisma.category.createMany({
      data: categoryDataList,
    });

    Logger.log('Categories successfully created');

    const categoryList = await prisma.category.findMany();

    const categoryBySlugList = Object.fromEntries(
      categoryList.map((category) => [category.slug, category])
    );

    const streamTitleList = generateStreamTitleList(categoryList);
    const usernameList = generateUsernameList();

    await prisma.$transaction(async (tx) => {
      const categoryKeyList = Object.keys(categoryBySlugList);

      for (const username of usernameList) {
        const randomCategory =
          categoryBySlugList[
            categoryKeyList[Math.floor(Math.random() * categoryKeyList.length)]
          ];
        const userExists = await tx.user.findUnique({
          where: {
            username,
          },
        });

        if (!userExists) {
          const createdUser = await tx.user.create({
            data: {
              email: `${username}@gmail.com`,
              password: await hash('12345678'),
              username,
              displayName: username,
              avatar: `${CHANNEL_IMAGE_PATH_PREFIX}/${username}.webp`,
              socialLinks: {
                createMany: {
                  data: [
                    {
                      title: 'test 1',
                      url: 'https://test_1',
                      position: 1,
                    },
                    {
                      title: 'test 2',
                      url: 'https://test_2',
                      position: 2,
                    },
                  ],
                },
              },
            },
          });

          const randomTitleList = streamTitleList[randomCategory?.slug] || [
            faker.lorem.sentence(),
          ];

          const randomTitle =
            randomTitleList[Math.floor(Math.random() * randomTitleList.length)];

          await tx.stream.create({
            data: {
              title: randomTitle,
              thumbnailUrl: `${STREAM_IMAGE_PATH_PREFIX}/${createdUser.username}.webp`,
              user: {
                connect: {
                  id: createdUser.id,
                },
              },
              category: {
                connect: {
                  id: randomCategory.id,
                },
              },
            },
          });

          Logger.log(
            `User with "${createdUser.username}" and his stream created successfully`
          );
        }
      }
    });

    Logger.log('Seeding a DB was successfully');
  } catch (error) {
    Logger.error(error);

    throw new BadRequestException('Error when seed a DB');
  } finally {
    Logger.log('Close BD connection...');

    await prisma.$disconnect();

    Logger.log('Close DB connection successfully');
  }
};

void main();
