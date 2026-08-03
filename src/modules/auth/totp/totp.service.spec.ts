import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@/src/core/prisma/prisma.service';

import { TotpService } from './totp.service';

describe('TotpService', () => {
  let service: TotpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TotpService,
        { provide: PrismaService, useValue: { user: { update: jest.fn() } } },
      ],
    }).compile();

    service = module.get<TotpService>(TotpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
