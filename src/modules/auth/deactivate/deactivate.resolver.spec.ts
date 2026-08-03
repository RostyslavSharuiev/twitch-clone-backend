import { Test, TestingModule } from '@nestjs/testing';

import { DeactivateResolver } from './deactivate.resolver';
import { DeactivateService } from './deactivate.service';

jest.mock('@/src/modules/libs/mail/mail.service', () => ({
  MailService: class MailService {},
}));

describe('DeactivateResolver', () => {
  let resolver: DeactivateResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeactivateResolver,
        {
          provide: DeactivateService,
          useValue: { sendDeactivateToken: jest.fn(), deactivate: jest.fn() },
        },
      ],
    }).compile();

    resolver = module.get<DeactivateResolver>(DeactivateResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
