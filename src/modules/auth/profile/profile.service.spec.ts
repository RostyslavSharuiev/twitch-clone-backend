import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { FileUpload } from 'graphql-upload/processRequest.mjs';
import type Upload from 'graphql-upload/Upload.mjs';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { User } from '@/src/generated/prisma/client';
import { StorageService } from '@/src/modules/libs/storage/storage.service';

import { ProfileService } from './profile.service';

jest.mock('sharp', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    resize: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from('img')),
  })),
}));

type MockPrismaService = {
  user: {
    update: jest.Mock;
    findUnique: jest.Mock;
  };
  socialLink: {
    findMany: jest.Mock;
    findFirst: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};

type MockStorageService = {
  remove: jest.Mock;
  upload: jest.Mock;
};

const createUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 'u1',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    email: 'foo@test.com',
    password: 'hash',
    username: 'foo',
    displayName: 'Foo',
    avatar: null,
    bio: null,
    isVerified: false,
    isDeactivated: false,
    deactivateAt: null,
    ...overrides,
  }) as User;

describe('ProfileService', () => {
  let service: ProfileService;
  let prisma: MockPrismaService;
  let storage: MockStorageService;

  beforeEach(async () => {
    prisma = {
      user: { update: jest.fn(), findUnique: jest.fn() },
      socialLink: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    storage = { remove: jest.fn(), upload: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: PrismaService, useValue: prisma },
        { provide: StorageService, useValue: storage },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('throws for invalid avatar upload', async () => {
    const invalidUpload: Upload = {
      file: undefined,
      promise: Promise.resolve(undefined as unknown as FileUpload),
    } as Upload;

    await expect(
      service.changeAvatar(createUser(), invalidUpload)
    ).rejects.toThrow(BadRequestException);
  });

  it('changes profile info and rejects duplicate username', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'u2' });

    await expect(
      service.changeInfo(createUser(), {
        username: 'bar',
        displayName: 'Bar',
        bio: 'bio',
      })
    ).rejects.toThrow(ConflictException);
  });

  it('creates and reorders social links', async () => {
    prisma.socialLink.findFirst.mockResolvedValue(null);
    prisma.socialLink.create.mockResolvedValue(true);

    await expect(
      service.createSocialLink(createUser(), { title: 'x', url: 'y' })
    ).resolves.toBe(true);

    await expect(
      service.reorderSocialLinks([{ id: '1', position: 2 }])
    ).resolves.toBe(true);
  });

  it('removes avatar when it exists', async () => {
    await expect(
      service.removeAvatar(createUser({ avatar: '/x' }))
    ).resolves.toBe(true);
  });
});
