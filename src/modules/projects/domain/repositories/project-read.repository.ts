export const PROJECT_READ_REPOSITORY = Symbol('PROJECT_READ_REPOSITORY');

export interface ProjectReadModel {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  createdAt: string;
  images: Array<{
    id: string;
    filename: string;
    operation: string;
    status: string;
    resultUrl?: string;
    createdAt: string;
  }>;
}

/** Repositório do READ model (Redis). Otimizado para consultas. */
export interface ProjectReadRepository {
  upsert(project: ProjectReadModel): Promise<void>;
  listByOwner(ownerId: string): Promise<ProjectReadModel[]>;
  getById(id: string): Promise<ProjectReadModel | null>;
}
