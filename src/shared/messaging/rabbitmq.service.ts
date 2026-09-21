import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { EXCHANGE, EXCHANGE_TYPE } from './topology';

type AmqpConnection = Awaited<ReturnType<typeof amqp.connect>>;

/**
 * Serviço central de mensageria. Conecta com retry, declara o exchange topic
 * e expõe publish/consume. Injetado pelos módulos que produzem ou consomem
 * eventos de domínio.
 */
@Injectable()
export class RabbitMqService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMqService.name);
  private connection?: AmqpConnection;
  private channel?: amqp.Channel;
  private readonly url: string;

  constructor(config: ConfigService) {
    this.url = config.get<string>(
      'RABBITMQ_URL',
      'amqp://guest:guest@localhost:5672',
    );
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }

  private async connect(retries = 10, delayMs = 3000): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.connection = await amqp.connect(this.url);
        this.channel = await this.connection.createChannel();
        await this.channel.assertExchange(EXCHANGE, EXCHANGE_TYPE, {
          durable: true,
        });
        this.logger.log('Conectado ao RabbitMQ.');
        return;
      } catch (err) {
        this.logger.warn(
          `Falha ao conectar no RabbitMQ (tentativa ${attempt}/${retries}).`,
        );
        if (attempt === retries) throw err;
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }

  private assertChannel(): amqp.Channel {
    if (!this.channel) throw new Error('RabbitMQ não conectado.');
    return this.channel;
  }

  /** Publica um evento no exchange com a routing key informada. */
  publish(routingKey: string, message: unknown): void {
    this.assertChannel().publish(
      EXCHANGE,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true, contentType: 'application/json' },
    );
  }

  /** Garante a fila, faz bind nas routing keys e registra o handler. */
  async consume<T>(
    queue: string,
    routingKeys: string[],
    handler: (message: T) => Promise<void> | void,
  ): Promise<void> {
    const channel = this.assertChannel();
    await channel.assertQueue(queue, { durable: true });
    for (const key of routingKeys) {
      await channel.bindQueue(queue, EXCHANGE, key);
    }
    await channel.consume(queue, async (msg) => {
      if (!msg) return;
      try {
        await handler(JSON.parse(msg.content.toString()) as T);
        channel.ack(msg);
      } catch (err) {
        this.logger.error(`Erro ao processar mensagem da fila ${queue}`, err as Error);
        channel.nack(msg, false, false);
      }
    });
  }
}
