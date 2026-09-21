/**
 * Topologia de mensageria compartilhada pelos módulos.
 * Um exchange `topic` concentra os eventos de domínio; cada módulo consumidor
 * cria sua fila e faz bind nas routing keys que lhe interessam (pub/sub).
 */
export const EXCHANGE = 'app.events';
export const EXCHANGE_TYPE = 'topic';

export const RoutingKeys = {
  ImageJobRequested: 'image.job.requested',
  ImageProcessed: 'image.processed',
  ProjectCreated: 'project.created',
} as const;

export type RoutingKey = (typeof RoutingKeys)[keyof typeof RoutingKeys];

export const Queues = {
  ImageJobs: 'image.jobs',
  ProjectImageResults: 'project.image-results',
  Notifications: 'notifications.fanout',
} as const;
