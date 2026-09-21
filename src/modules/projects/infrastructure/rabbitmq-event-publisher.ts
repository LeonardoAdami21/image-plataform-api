import { Injectable } from '@nestjs/common';
import { RabbitMqService } from '../../../shared/messaging/rabbitmq.service';
import { EventPublisher } from '../application/ports/event-publisher.port';

/** Adapta o RabbitMqService (infra) à porta EventPublisher (aplicação). */
@Injectable()
export class RabbitMqEventPublisher implements EventPublisher {
  constructor(private readonly rabbit: RabbitMqService) {}

  publish(routingKey: string, event: unknown): void {
    this.rabbit.publish(routingKey, event);
  }
}
