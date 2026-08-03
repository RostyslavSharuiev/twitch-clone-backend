import { Test, TestingModule } from '@nestjs/testing';

import { IngressResolver } from './ingress.resolver';
import { IngressService } from './ingress.service';

describe('IngressResolver', () => {
  let resolver: IngressResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngressResolver,
        { provide: IngressService, useValue: { create: jest.fn() } },
      ],
    }).compile();

    resolver = module.get<IngressResolver>(IngressResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
