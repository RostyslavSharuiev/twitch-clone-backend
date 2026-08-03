import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { StorageService } from '@/src/modules/libs/storage/storage.service';

import { StreamService } from './stream.service';

describe('StreamService', () => {
  let service: StreamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StreamService,
        { provide: PrismaService, useValue: { stream: {}, user: {} } },
        { provide: ConfigService, useValue: { getOrThrow: jest.fn() } },
        {
          provide: StorageService,
          useValue: { remove: jest.fn(), upload: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<StreamService>(StreamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
