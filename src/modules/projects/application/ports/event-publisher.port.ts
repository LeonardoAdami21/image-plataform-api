export const EVENT_PUBLISHER = Symbol('EVENT_PUBLISHER');

/** Porta para publicar eventos de domínio (implementada sobre o RabbitMQ). */
export interface EventPublisher {
  publish(routingKey: string, event: unknown): void;
}
