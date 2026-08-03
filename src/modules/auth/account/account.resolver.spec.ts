import { Test, TestingModule } from '@nestjs/testing';

import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';

jest.mock('@/src/modules/libs/mail/mail.service', () => ({
  MailService: class MailService {},
}));

describe('AccountResolver', () => {
  let resolver: AccountResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountResolver,
        {
          provide: AccountService,
          useValue: {
            me: jest.fn(),
            create: jest.fn(),
            changeEmail: jest.fn(),
            changePassword: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<AccountResolver>(AccountResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
