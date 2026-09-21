import { Inject, Injectable } from '@nestjs/common';
import {
  PROJECT_READ_REPOSITORY,
  ProjectReadModel,
  ProjectReadRepository,
} from '../../domain/repositories/project-read.repository';
import {
  ForbiddenProjectAccessError,
  ProjectNotFoundError,
} from '../errors/project.errors';

/** QUERY: obtém um projeto por id — lê do read model (Redis). */
@Injectable()
export class GetProjectUseCase {
  constructor(
    @Inject(PROJECT_READ_REPOSITORY)
    private readonly read: ProjectReadRepository,
  ) {}

  async execute(ownerId: string, id: string): Promise<ProjectReadModel> {
    const project = await this.read.getById(id);
    if (!project) throw new ProjectNotFoundError(id);
    if (project.ownerId !== ownerId) throw new ForbiddenProjectAccessError();
    return project;
  }
}
