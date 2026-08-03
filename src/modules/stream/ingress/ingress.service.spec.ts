import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { LivekitService } from '@/src/modules/libs/livekit/livekit.service';

import { IngressService } from './ingress.service';

describe('IngressService', () => {
  let service: IngressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngressService,
        { provide: PrismaService, useValue: { stream: { update: jest.fn() } } },
        { provide: LivekitService, useValue: { ingress: {}, room: {} } },
      ],
    }).compile();

    service = module.get<IngressService>(IngressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
