import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { ProjectRepository } from '../domain/repositories/project.repository';
import { Project } from '../domain/entities/project.entity';
import {
  Image,
  ImageOperation,
  ImageStatus,
} from '../domain/entities/image.entity';

interface ImageRow {
  id: string;
  projectId: string;
  ownerId: string;
  filename: string;
  operation: string;
  status: string;
  resultUrl: string | null;
  createdAt: Date;
}

@Injectable()
export class PrismaProjectRepository implements ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(project: Project): Promise<void> {
    await this.prisma.project.upsert({
      where: { id: project.id },
      create: {
        id: project.id,
        ownerId: project.ownerId,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
      },
      update: { name: project.name, description: project.description },
    });
  }

  async findById(id: string): Promise<Project | null> {
    const row = await this.prisma.project.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!row) return null;
    return Project.create({
      id: row.id,
      ownerId: row.ownerId,
      name: row.name,
      description: row.description,
      createdAt: row.createdAt,
      images: row.images.map((i: ImageRow) => this.imageToDomain(i)),
    });
  }

  async addImage(image: Image): Promise<void> {
    await this.prisma.image.create({
      data: {
        id: image.id,
        projectId: image.projectId,
        ownerId: image.ownerId,
        filename: image.filename,
        operation: image.operation,
        status: image.status,
        resultUrl: image.resultUrl,
        createdAt: image.createdAt,
      },
    });
  }

  async updateImage(image: Image): Promise<void> {
    await this.prisma.image.update({
      where: { id: image.id },
      data: { status: image.status, resultUrl: image.resultUrl ?? null },
    });
  }

  async findImageById(imageId: string): Promise<Image | null> {
    const row = await this.prisma.image.findUnique({ where: { id: imageId } });
    return row ? this.imageToDomain(row) : null;
  }

  private imageToDomain(row: ImageRow): Image {
    return Image.create({
      id: row.id,
      projectId: row.projectId,
      ownerId: row.ownerId,
      filename: row.filename,
      operation: row.operation as ImageOperation,
      status: row.status as ImageStatus,
      resultUrl: row.resultUrl ?? undefined,
      createdAt: row.createdAt,
    });
  }
}
