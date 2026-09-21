import { Inject, Injectable } from '@nestjs/common';
import {
  PROJECT_READ_REPOSITORY,
  type ProjectReadModel,
  type ProjectReadRepository,
} from '../../domain/repositories/project-read.repository';

/** QUERY: lista projetos do usuário — lê do read model (Redis). */
@Injectable()
export class ListProjectsUseCase {
  constructor(
    @Inject(PROJECT_READ_REPOSITORY)
    private readonly read: ProjectReadRepository,
  ) {}

  execute(ownerId: string): Promise<ProjectReadModel[]> {
    return this.read.listByOwner(ownerId);
  }
}
