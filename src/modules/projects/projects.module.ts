import { Module } from '@nestjs/common';
import { ProjectController } from './presentation/project.controller';
import { CreateProjectUseCase } from './application/use-cases/create-project.usecase';
import { ListProjectsUseCase } from './application/use-cases/list-projects.usecase';
import { GetProjectUseCase } from './application/use-cases/get-project.usecase';
import { AddImageUseCase } from './application/use-cases/add-image.usecase';
import { ApplyImageResultUseCase } from './application/use-cases/apply-image-result.usecase';
import { PROJECT_REPOSITORY } from './domain/repositories/project.repository';
import { PROJECT_READ_REPOSITORY } from './domain/repositories/project-read.repository';
import { EVENT_PUBLISHER } from './application/ports/event-publisher.port';
import { ID_GENERATOR } from './application/ports/id-generator.port';
import { PrismaProjectRepository } from './infrastructure/prisma-project.repository';
import { RedisProjectReadRepository } from './infrastructure/redis-project-read.repository';
import { RabbitMqEventPublisher } from './infrastructure/rabbitmq-event-publisher';
import { ImageProcessedConsumer } from './infrastructure/image-processed.consumer';
import { UuidGenerator } from './infrastructure/uuid.generator';

@Module({
  controllers: [ProjectController],
  providers: [
    CreateProjectUseCase,
    ListProjectsUseCase,
    GetProjectUseCase,
    AddImageUseCase,
    ApplyImageResultUseCase,
    ImageProcessedConsumer,
    { provide: PROJECT_REPOSITORY, useClass: PrismaProjectRepository },
    { provide: PROJECT_READ_REPOSITORY, useClass: RedisProjectReadRepository },
    { provide: EVENT_PUBLISHER, useClass: RabbitMqEventPublisher },
    { provide: ID_GENERATOR, useClass: UuidGenerator },
  ],
})
export class ProjectsModule {}
