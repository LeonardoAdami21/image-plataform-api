import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export interface Notification {
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  at: string;
}

/**
 * Gateway Socket.IO. Cada cliente entra numa room com o seu userId
 * (handshake: auth.userId ou ?userId=). Notificações vão só para o dono.
 */
@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket): void {
    const userId =
      (client.handshake.auth?.userId as string) ||
      (client.handshake.query?.userId as string);
    if (!userId) {
      this.logger.warn(`Cliente ${client.id} sem userId — desconectando.`);
      client.disconnect(true);
      return;
    }
    client.join(this.room(userId));
    this.logger.log(`Cliente ${client.id} entrou na room do usuário ${userId}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Cliente ${client.id} desconectou.`);
  }

  notifyUser(userId: string, notification: Notification): void {
    this.server.to(this.room(userId)).emit('notification', notification);
  }

  private room(userId: string): string {
    return `user:${userId}`;
  }
}
