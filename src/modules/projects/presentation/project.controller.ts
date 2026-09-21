import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/security/jwt-auth.guard';
import { CurrentUserId } from '../../../shared/security/current-user.decorator';
import { CreateProjectUseCase } from '../application/use-cases/create-project.usecase';
import { ListProjectsUseCase } from '../application/use-cases/list-projects.usecase';
import { GetProjectUseCase } from '../application/use-cases/get-project.usecase';
import { AddImageUseCase } from '../application/use-cases/add-image.usecase';
import {
  ForbiddenProjectAccessError,
  ProjectNotFoundError,
} from '../application/errors/project.errors';
import { CreateProjectDto } from './dtos/create-project.dto';
import { AddImageDto } from './dtos/add-image.dto';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly createProject: CreateProjectUseCase,
    private readonly listProjects: ListProjectsUseCase,
    private readonly getProject: GetProjectUseCase,
    private readonly addImage: AddImageUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria um projeto (comando)' })
  async create(@CurrentUserId() ownerId: string, @Body() dto: CreateProjectDto) {
    const project = await this.createProject.execute({ ownerId, ...dto });
    return project.toReadModel();
  }

  @Get()
  @ApiOperation({ summary: 'Lista projetos do usuário (query — Redis)' })
  list(@CurrentUserId() ownerId: string) {
    return this.listProjects.execute(ownerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalha um projeto (query — Redis)' })
  async detail(@CurrentUserId() ownerId: string, @Param('id') id: string) {
    try {
      return await this.getProject.execute(ownerId, id);
    } catch (err) {
      throw this.translate(err);
    }
  }

  @Post(':id/images')
  @ApiOperation({ summary: 'Anexa imagem e dispara o processamento (comando)' })
  async attachImage(
    @CurrentUserId() ownerId: string,
    @Param('id') projectId: string,
    @Body() dto: AddImageDto,
  ) {
    try {
      const image = await this.addImage.execute({
        ownerId,
        projectId,
        filename: dto.filename,
        operation: dto.operation,
      });
      return image.toJSON();
    } catch (err) {
      throw this.translate(err);
    }
  }

  private translate(err: unknown): Error {
    if (err instanceof ProjectNotFoundError) return new NotFoundException(err.message);
    if (err instanceof ForbiddenProjectAccessError)
      return new ForbiddenException(err.message);
    return err as Error;
  }
}
