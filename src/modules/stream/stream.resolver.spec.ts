import { Test, TestingModule } from '@nestjs/testing';

import { StreamResolver } from './stream.resolver';
import { StreamService } from './stream.service';

describe('StreamResolver', () => {
  let resolver: StreamResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StreamResolver,
        {
          provide: StreamService,
          useValue: {
            findAll: jest.fn(),
            findRandom: jest.fn(),
            changeInfo: jest.fn(),
            changeThumbnail: jest.fn(),
            removeThumbnail: jest.fn(),
            generateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<StreamResolver>(StreamResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
