import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { MailService } from '@/src/modules/libs/mail/mail.service';

import { DeactivateService } from './deactivate.service';

jest.mock('@/src/modules/libs/mail/mail.service', () => ({
  MailService: class MailService {},
}));

describe('DeactivateService', () => {
  let service: DeactivateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeactivateService,
        { provide: PrismaService, useValue: { token: {}, user: {} } },
        { provide: ConfigService, useValue: { getOrThrow: jest.fn() } },
        { provide: MailService, useValue: { sendDeactivateToken: jest.fn() } },
      ],
    }).compile();

    service = module.get<DeactivateService>(DeactivateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
