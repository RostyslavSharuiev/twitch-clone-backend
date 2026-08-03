import { Test, TestingModule } from '@nestjs/testing';

import { PasswordRecoveryResolver } from './password-recovery.resolver';
import { PasswordRecoveryService } from './password-recovery.service';

jest.mock('@/src/modules/libs/mail/mail.service', () => ({
  MailService: class MailService {},
}));

describe('PasswordRecoveryResolver', () => {
  let resolver: PasswordRecoveryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordRecoveryResolver,
        {
          provide: PasswordRecoveryService,
          useValue: { resetPassword: jest.fn(), newPassword: jest.fn() },
        },
      ],
    }).compile();

    resolver = module.get<PasswordRecoveryResolver>(PasswordRecoveryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
