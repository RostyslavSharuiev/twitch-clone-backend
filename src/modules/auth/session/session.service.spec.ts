import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { RedisService } from '@/src/core/redis/redis.service';
import { VerificationService } from '@/src/modules/auth/verification/verification.service';

import { SessionService } from './session.service';

jest.mock('@/src/modules/libs/mail/mail.service', () => ({
  MailService: class MailService {},
}));

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        { provide: PrismaService, useValue: { user: {} } },
        {
          provide: RedisService,
          useValue: {
            client: { keys: jest.fn(), get: jest.fn(), del: jest.fn() },
          },
        },
        { provide: ConfigService, useValue: { getOrThrow: jest.fn() } },
        {
          provide: VerificationService,
          useValue: { sendVerificationToken: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
