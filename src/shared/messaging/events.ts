import { RoutingKeys } from './topology';

/** Envelope padrão de todo evento de domínio publicado no broker. */
export interface DomainEvent<TName extends string, TPayload> {
  name: TName;
  eventId: string;
  occurredAt: string;
  payload: TPayload;
}

export interface ImageJobRequestedPayload {
  imageId: string;
  projectId: string;
  ownerId: string;
  filename: string;
  operation: 'thumbnail' | 'grayscale' | 'resize';
}

export interface ImageProcessedPayload {
  imageId: string;
  projectId: string;
  ownerId: string;
  status: 'done' | 'failed';
  resultUrl?: string;
  error?: string;
}

export interface ProjectCreatedPayload {
  projectId: string;
  ownerId: string;
  name: string;
}

export type ImageJobRequestedEvent = DomainEvent<
  typeof RoutingKeys.ImageJobRequested,
  ImageJobRequestedPayload
>;
export type ImageProcessedEvent = DomainEvent<
  typeof RoutingKeys.ImageProcessed,
  ImageProcessedPayload
>;
export type ProjectCreatedEvent = DomainEvent<
  typeof RoutingKeys.ProjectCreated,
  ProjectCreatedPayload
>;
export type AnyDomainEvent =
  | ImageJobRequestedEvent
  | ImageProcessedEvent
  | ProjectCreatedEvent;

export function buildEvent<TName extends string, TPayload>(
  name: TName,
  payload: TPayload,
): DomainEvent<TName, TPayload> {
  return {
    name,
    eventId: Date.now().toString(36) + Math.random().toString(36).slice(2, 10),
    occurredAt: new Date().toISOString(),
    payload,
  };
}
