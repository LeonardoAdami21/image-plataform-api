import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../shared/redis/redis.service';
import {
  ProjectReadModel,
  ProjectReadRepository,
} from '../domain/repositories/project-read.repository';

/**
 * Read model em Redis.
 *  - project:{id}             -> JSON do projeto
 *  - owner:{ownerId}:projects  -> Set com os ids do dono (índice)
 */
@Injectable()
export class RedisProjectReadRepository implements ProjectReadRepository {
  constructor(private readonly redis: RedisService) {}

  private key(id: string) {
    return `project:${id}`;
  }
  private ownerKey(ownerId: string) {
    return `owner:${ownerId}:projects`;
  }

  async upsert(project: ProjectReadModel): Promise<void> {
    const pipeline = this.redis.client.pipeline();
    pipeline.set(this.key(project.id), JSON.stringify(project));
    pipeline.sadd(this.ownerKey(project.ownerId), project.id);
    await pipeline.exec();
  }

  async getById(id: string): Promise<ProjectReadModel | null> {
    const raw = await this.redis.client.get(this.key(id));
    return raw ? (JSON.parse(raw) as ProjectReadModel) : null;
  }

  async listByOwner(ownerId: string): Promise<ProjectReadModel[]> {
    const ids = await this.redis.client.smembers(this.ownerKey(ownerId));
    if (ids.length === 0) return [];
    const rows = await this.redis.client.mget(ids.map((id) => this.key(id)));
    return rows
      .filter((r): r is string => r !== null)
      .map((r) => JSON.parse(r) as ProjectReadModel)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}
