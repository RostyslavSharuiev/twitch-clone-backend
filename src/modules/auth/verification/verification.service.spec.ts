import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { MailService } from '@/src/modules/libs/mail/mail.service';

import { VerificationService } from './verification.service';

jest.mock('@/src/modules/libs/mail/mail.service', () => ({
  MailService: class MailService {},
}));

describe('VerificationService', () => {
  let service: VerificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationService,
        { provide: PrismaService, useValue: { token: {}, user: {} } },
        {
          provide: MailService,
          useValue: { sendVerificationToken: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<VerificationService>(VerificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
