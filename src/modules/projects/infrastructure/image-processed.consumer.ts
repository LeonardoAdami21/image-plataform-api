import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMqService } from '../../../shared/messaging/rabbitmq.service';
import { Queues, RoutingKeys } from '../../../shared/messaging/topology';
import { ImageProcessedEvent } from '../../../shared/messaging/events';
import { ApplyImageResultUseCase } from '../application/use-cases/apply-image-result.usecase';

/** Consome image.processed e atualiza os modelos de escrita/leitura. */
@Injectable()
export class ImageProcessedConsumer implements OnModuleInit {
  private readonly logger = new Logger(ImageProcessedConsumer.name);

  constructor(
    private readonly rabbit: RabbitMqService,
    private readonly applyResult: ApplyImageResultUseCase,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbit.consume<ImageProcessedEvent>(
      Queues.ProjectImageResults,
      [RoutingKeys.ImageProcessed],
      async (event) => {
        this.logger.log(
          `image.processed: imagem ${event.payload.imageId} (${event.payload.status})`,
        );
        await this.applyResult.execute(event.payload);
      },
    );
    this.logger.log('Consumindo eventos image.processed.');
  }
}
