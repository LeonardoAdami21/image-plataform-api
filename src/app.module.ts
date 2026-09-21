import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Shared kernel (módulos globais)
import { PrismaModule } from './shared/prisma/prisma.module';
import { RedisModule } from './shared/redis/redis.module';
import { MessagingModule } from './shared/messaging/messaging.module';
import { SecurityModule } from './shared/security/security.module';

// Módulos de feature
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ImagesModule } from './modules/images/images.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Infra compartilhada
    PrismaModule,
    RedisModule,
    MessagingModule,
    SecurityModule,
    // Features
    AuthModule,
    ProjectsModule,
    ImagesModule,
    NotificationsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
