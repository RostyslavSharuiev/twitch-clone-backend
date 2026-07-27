import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  public readonly client: RedisClientType<any, any, any, 2, any>;

  public constructor(private readonly configService: ConfigService) {
    this.client = createClient({
      url: configService.getOrThrow<string>('REDIS_URI'),
      RESP: 2,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      },
    });

    void this.client.connect().catch((err) => {
      console.error('Redis client connect error:', err);
    });
  }

  public async onModuleDestroy() {
    try {
      await this.client.disconnect();
    } catch {
      // ignore shutdown errors
    }
  }
}
