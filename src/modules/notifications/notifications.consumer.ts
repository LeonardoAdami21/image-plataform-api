import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMqService } from '../../shared/messaging/rabbitmq.service';
import { Queues, RoutingKeys } from '../../shared/messaging/topology';
import { AnyDomainEvent } from '../../shared/messaging/events';
import { NotificationsGateway } from './notifications.gateway';

/** Consome eventos de domínio e os traduz em notificações WebSocket. */
@Injectable()
export class NotificationsConsumer implements OnModuleInit {
  private readonly logger = new Logger(NotificationsConsumer.name);

  constructor(
    private readonly rabbit: RabbitMqService,
    private readonly gateway: NotificationsGateway,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbit.consume<AnyDomainEvent>(
      Queues.Notifications,
      [RoutingKeys.ProjectCreated, RoutingKeys.ImageProcessed],
      (event) => this.handle(event),
    );
    this.logger.log('Consumindo eventos para notificações.');
  }

  private handle(event: AnyDomainEvent): void {
    const at = new Date().toISOString();

    if (event.name === RoutingKeys.ProjectCreated) {
      const p = event.payload;
      this.gateway.notifyUser(p.ownerId, {
        type: 'project.created',
        title: 'Projeto criado',
        message: `O projeto "${p.name}" foi criado.`,
        data: { projectId: p.projectId },
        at,
      });
      return;
    }

    if (event.name === RoutingKeys.ImageProcessed) {
      const p = event.payload;
      const ok = p.status === 'done';
      this.gateway.notifyUser(p.ownerId, {
        type: 'image.processed',
        title: ok ? 'Imagem processada' : 'Falha no processamento',
        message: ok
          ? 'Sua imagem foi processada com sucesso.'
          : `O processamento falhou: ${p.error ?? 'erro desconhecido'}.`,
        data: {
          imageId: p.imageId,
          projectId: p.projectId,
          resultUrl: p.resultUrl,
          status: p.status,
        },
        at,
      });
    }
  }
}
