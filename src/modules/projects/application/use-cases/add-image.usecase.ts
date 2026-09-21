import { Inject, Injectable } from '@nestjs/common';
import { RoutingKeys } from '../../../../shared/messaging/topology';
import {
  buildEvent,
  ImageJobRequestedPayload,
} from '../../../../shared/messaging/events';
import {
  PROJECT_REPOSITORY,
  type ProjectRepository,
} from '../../domain/repositories/project.repository';
import {
  PROJECT_READ_REPOSITORY,
  type ProjectReadRepository,
} from '../../domain/repositories/project-read.repository';
import {
  EVENT_PUBLISHER,
  type EventPublisher,
} from '../ports/event-publisher.port';
import { ID_GENERATOR, type IdGenerator } from '../ports/id-generator.port';
import { AddImageInput } from '../dtos/project.dto';
import {
  ForbiddenProjectAccessError,
  ProjectNotFoundError,
} from '../errors/project.errors';
import { Image } from '../../domain/entities/image.entity';

/**
 * COMANDO: adiciona imagem ao projeto e dispara o job de processamento.
 * Publica image.job.requested — consumido pelo módulo images.
 */
@Injectable()
export class AddImageUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY) private readonly write: ProjectRepository,
    @Inject(PROJECT_READ_REPOSITORY)
    private readonly read: ProjectReadRepository,
    @Inject(EVENT_PUBLISHER) private readonly events: EventPublisher,
    @Inject(ID_GENERATOR) private readonly ids: IdGenerator,
  ) {}

  async execute(input: AddImageInput): Promise<Image> {
    const project = await this.write.findById(input.projectId);
    if (!project) throw new ProjectNotFoundError(input.projectId);
    if (project.ownerId !== input.ownerId) {
      throw new ForbiddenProjectAccessError();
    }

    const image = project.addImage({
      id: this.ids.generate(),
      filename: input.filename,
      operation: input.operation,
    });

    await this.write.addImage(image);
    await this.read.upsert(project.toReadModel());

    this.events.publish(
      RoutingKeys.ImageJobRequested,
      buildEvent<typeof RoutingKeys.ImageJobRequested, ImageJobRequestedPayload>(
        RoutingKeys.ImageJobRequested,
        {
          imageId: image.id,
          projectId: project.id,
          ownerId: project.ownerId,
          filename: image.filename,
          operation: image.operation,
        },
      ),
    );

    return image;
  }
}
