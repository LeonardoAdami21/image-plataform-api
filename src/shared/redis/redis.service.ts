import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  public readonly client: Redis;

  constructor(config: ConfigService) {
    const url = config.get<string>('REDIS_URL', 'redis://localhost:6379');
    this.client = new Redis(url, { lazyConnect: true });
  }

  async onModuleInit(): Promise<void> {
    await this.client.connect();
  }
  async onModuleDestroy(): Promise<void> {
    this.client.disconnect();
  }
}
