import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let send: jest.Mock;

  beforeEach(async () => {
    send = jest.fn().mockResolvedValue(true);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn(
              (key: string) =>
                ({
                  S3_ENDPOINT: 'http://localhost',
                  S3_REGION: 'us-east-1',
                  S3_ACCESS_KEY_ID: 'id',
                  S3_SECRET_ACCESS_KEY_ID: 'secret',
                  S3_BUCKET_NAME: 'bucket',
                })[key]
            ),
          },
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
    Object.defineProperty(service, 'client', {
      value: { send },
      configurable: true,
    });
  });

  it('uploads a file', async () => {
    await expect(
      service.upload(Buffer.from('x'), 'key', 'image/png')
    ).resolves.toBeUndefined();
  });
});
