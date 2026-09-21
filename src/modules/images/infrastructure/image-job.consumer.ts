import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMqService } from '../../../shared/messaging/rabbitmq.service';
import { Queues, RoutingKeys } from '../../../shared/messaging/topology';
import { ImageJobRequestedEvent } from '../../../shared/messaging/events';
import { ProcessImageUseCase } from '../application/process-image.usecase';

/** Consome image.job.requested e dispara o processamento. */
@Injectable()
export class ImageJobConsumer implements OnModuleInit {
  private readonly logger = new Logger(ImageJobConsumer.name);

  constructor(
    private readonly rabbit: RabbitMqService,
    private readonly processImage: ProcessImageUseCase,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbit.consume<ImageJobRequestedEvent>(
      Queues.ImageJobs,
      [RoutingKeys.ImageJobRequested],
      async (event) => {
        this.logger.log(`Job recebido para imagem ${event.payload.imageId}`);
        await this.processImage.execute(event.payload);
      },
    );
    this.logger.log('Consumindo jobs image.job.requested.');
  }
}
