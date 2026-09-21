import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsConsumer } from './notifications.consumer';

@Module({
  providers: [NotificationsGateway, NotificationsConsumer],
})
export class NotificationsModule {}
