import { Inject, Injectable } from '@nestjs/common';
import { RoutingKeys } from '../../../../shared/messaging/topology';
import {
  buildEvent,
  ProjectCreatedPayload,
} from '../../../../shared/messaging/events';
import { Project } from '../../domain/entities/project.entity';
import {
  PROJECT_REPOSITORY,
  ProjectRepository,
} from '../../domain/repositories/project.repository';
import {
  PROJECT_READ_REPOSITORY,
  ProjectReadRepository,
} from '../../domain/repositories/project-read.repository';
import { EVENT_PUBLISHER, EventPublisher } from '../ports/event-publisher.port';
import { ID_GENERATOR, IdGenerator } from '../ports/id-generator.port';
import { CreateProjectInput } from '../dtos/project.dto';

/**
 * COMANDO: cria um projeto.
 * 1) grava no write model (Postgres); 2) projeta no read model (Redis);
 * 3) publica project.created no broker.
 */
@Injectable()
export class CreateProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY) private readonly write: ProjectRepository,
    @Inject(PROJECT_READ_REPOSITORY)
    private readonly read: ProjectReadRepository,
    @Inject(EVENT_PUBLISHER) private readonly events: EventPublisher,
    @Inject(ID_GENERATOR) private readonly ids: IdGenerator,
  ) {}

  async execute(input: CreateProjectInput): Promise<Project> {
    const project = Project.create({
      id: this.ids.generate(),
      ownerId: input.ownerId,
      name: input.name,
      description: input.description,
    });

    await this.write.save(project);
    await this.read.upsert(project.toReadModel());

    this.events.publish(
      RoutingKeys.ProjectCreated,
      buildEvent<typeof RoutingKeys.ProjectCreated, ProjectCreatedPayload>(
        RoutingKeys.ProjectCreated,
        { projectId: project.id, ownerId: project.ownerId, name: project.name },
      ),
    );

    return project;
  }
}
