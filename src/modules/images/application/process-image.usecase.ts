import { Inject, Injectable, Logger } from '@nestjs/common';
import { RabbitMqService } from '../../../shared/messaging/rabbitmq.service';
import { RoutingKeys } from '../../../shared/messaging/topology';
import {
  buildEvent,
  ImageJobRequestedPayload,
  ImageProcessedPayload,
} from '../../../shared/messaging/events';
import {
  IMAGE_PROCESSOR,
  type ImageProcessor,
} from './ports/image-processor.port';

/**
 * Recebe um job, processa a imagem e publica image.processed.
 * Falhas viram status 'failed' (também publicado).
 */
@Injectable()
export class ProcessImageUseCase {
  private readonly logger = new Logger(ProcessImageUseCase.name);

  constructor(
    @Inject(IMAGE_PROCESSOR) private readonly processor: ImageProcessor,
    private readonly rabbit: RabbitMqService,
  ) {}

  async execute(job: ImageJobRequestedPayload): Promise<void> {
    let payload: ImageProcessedPayload;
    try {
      const { resultUrl } = await this.processor.process({
        imageId: job.imageId,
        filename: job.filename,
        operation: job.operation,
      });
      payload = {
        imageId: job.imageId,
        projectId: job.projectId,
        ownerId: job.ownerId,
        status: 'done',
        resultUrl,
      };
      this.logger.log(`Imagem ${job.imageId} processada -> ${resultUrl}`);
    } catch (err) {
      payload = {
        imageId: job.imageId,
        projectId: job.projectId,
        ownerId: job.ownerId,
        status: 'failed',
        error: (err as Error).message,
      };
      this.logger.error(`Falha ao processar ${job.imageId}`, err as Error);
    }

    this.rabbit.publish(
      RoutingKeys.ImageProcessed,
      buildEvent<typeof RoutingKeys.ImageProcessed, ImageProcessedPayload>(
        RoutingKeys.ImageProcessed,
        payload,
      ),
    );
  }
}
