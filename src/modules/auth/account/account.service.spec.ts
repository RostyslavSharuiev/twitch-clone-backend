import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { hash, verify } from 'argon2';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import type { User } from '@/src/generated/prisma/client';
import { VerificationService } from '@/src/modules/auth/verification/verification.service';

import { AccountService } from './account.service';

jest.mock('@/src/modules/libs/mail/mail.service', () => ({
  MailService: class MailService {},
}));

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

type MockPrismaService = {
  user: {
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
};

type MockVerificationService = {
  sendVerificationToken: jest.Mock;
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

describe('AccountService', () => {
  let service: AccountService;
  let prisma: MockPrismaService;
  let verificationService: MockVerificationService;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };
    verificationService = {
      sendVerificationToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        { provide: PrismaService, useValue: prisma },
        { provide: VerificationService, useValue: verificationService },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('creates a user and sends verification email', async () => {
    prisma.user.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    (hash as jest.MockedFunction<typeof hash>).mockResolvedValue('hashed');
    prisma.user.create.mockResolvedValue({ id: 'u1' });

    await expect(
      service.create({
        username: 'foo',
        email: 'foo@test.com',
        password: 'pass',
      })
    ).resolves.toBe(true);

    expect(prisma.user.create).toHaveBeenCalled();
    expect(verificationService.sendVerificationToken).toHaveBeenCalled();
  });

  it('throws when username already exists', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'x' });

    await expect(
      service.create({
        username: 'foo',
        email: 'foo@test.com',
        password: 'pass',
      })
    ).rejects.toThrow(ConflictException);
  });

  it('throws when emails are the same', async () => {
    await expect(
      service.changeEmail(createUser({ email: 'same@test.com' }), {
        email: 'same@test.com',
      })
    ).rejects.toThrow(BadRequestException);
  });

  it('updates email', async () => {
    prisma.user.update.mockResolvedValue(true);

    await expect(
      service.changeEmail(createUser({ email: 'old@test.com' }), {
        email: 'new@test.com',
      })
    ).resolves.toBe(true);
  });

  it('throws when password is invalid', async () => {
    (verify as jest.MockedFunction<typeof verify>).mockResolvedValue(false);

    await expect(
      service.changePassword(createUser({ password: 'hash' }), {
        oldPassword: 'wrong',
        newPassword: 'new',
      })
    ).rejects.toThrow(UnauthorizedException);
  });
});
