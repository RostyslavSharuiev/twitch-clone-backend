import { Test, TestingModule } from '@nestjs/testing';

import { VerificationResolver } from './verification.resolver';
import { VerificationService } from './verification.service';

jest.mock('@/src/modules/libs/mail/mail.service', () => ({
  MailService: class MailService {},
}));

describe('VerificationResolver', () => {
  let resolver: VerificationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationResolver,
        {
          provide: VerificationService,
          useValue: { verify: jest.fn(), sendVerificationToken: jest.fn() },
        },
      ],
    }).compile();

    resolver = module.get<VerificationResolver>(VerificationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
