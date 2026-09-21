import { Project } from '../entities/project.entity';
import { Image } from '../entities/image.entity';

export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');

/** Repositório do WRITE model (Postgres). Fonte da verdade. */
export interface ProjectRepository {
  save(project: Project): Promise<void>;
  findById(id: string): Promise<Project | null>;
  addImage(image: Image): Promise<void>;
  updateImage(image: Image): Promise<void>;
  findImageById(imageId: string): Promise<Image | null>;
}
