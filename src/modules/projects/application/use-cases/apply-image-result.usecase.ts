import { Inject, Injectable, Logger } from '@nestjs/common';
import { ImageProcessedPayload } from '../../../../shared/messaging/events';
import {
  PROJECT_REPOSITORY,
  type ProjectRepository,
} from '../../domain/repositories/project.repository';
import {
  PROJECT_READ_REPOSITORY,
  type ProjectReadRepository,
} from '../../domain/repositories/project-read.repository';

/** Aplica o resultado do processamento (evento image.processed). */
@Injectable()
export class ApplyImageResultUseCase {
  private readonly logger = new Logger(ApplyImageResultUseCase.name);

  constructor(
    @Inject(PROJECT_REPOSITORY) private readonly write: ProjectRepository,
    @Inject(PROJECT_READ_REPOSITORY)
    private readonly read: ProjectReadRepository,
  ) {}

  async execute(payload: ImageProcessedPayload): Promise<void> {
    const image = await this.write.findImageById(payload.imageId);
    if (!image) {
      this.logger.warn(`Imagem ${payload.imageId} não encontrada — ignorando.`);
      return;
    }

    if (payload.status === 'done' && payload.resultUrl) {
      image.markProcessed(payload.resultUrl);
    } else {
      image.markFailed();
    }
    await this.write.updateImage(image);

    const project = await this.write.findById(payload.projectId);
    if (project) await this.read.upsert(project.toReadModel());
  }
}
