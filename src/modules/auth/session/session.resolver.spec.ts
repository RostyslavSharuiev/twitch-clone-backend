import { Test, TestingModule } from '@nestjs/testing';

import { SessionResolver } from './session.resolver';
import { SessionService } from './session.service';

jest.mock('@/src/modules/libs/mail/mail.service', () => ({
  MailService: class MailService {},
}));

describe('SessionResolver', () => {
  let resolver: SessionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionResolver,
        {
          provide: SessionService,
          useValue: {
            findByUser: jest.fn(),
            findCurrent: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
            clearSession: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<SessionResolver>(SessionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
