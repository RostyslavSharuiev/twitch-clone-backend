import { Test, TestingModule } from '@nestjs/testing';

import { LivekitService } from './livekit.service';
import { LiveKitOptionsSymbol } from './types/livekit.types';

describe('LivekitService', () => {
  let service: LivekitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LivekitService,
        {
          provide: LiveKitOptionsSymbol,
          useValue: {
            apiUrl: 'http://localhost',
            apiKey: 'key',
            apiSecret: 'secret',
          },
        },
      ],
    }).compile();

    service = module.get<LivekitService>(LivekitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
