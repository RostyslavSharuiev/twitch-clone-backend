import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { MailService } from '@/src/modules/libs/mail/mail.service';

import { PasswordRecoveryService } from './password-recovery.service';

jest.mock('@/src/modules/libs/mail/mail.service', () => ({
  MailService: class MailService {},
}));

describe('PasswordRecoveryService', () => {
  let service: PasswordRecoveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordRecoveryService,
        { provide: PrismaService, useValue: { user: {}, token: {} } },
        {
          provide: MailService,
          useValue: { sendPasswordResetToken: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<PasswordRecoveryService>(PasswordRecoveryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
