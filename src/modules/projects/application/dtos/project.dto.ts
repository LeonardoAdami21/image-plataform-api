import { ImageOperation } from '../../domain/entities/image.entity';

export interface CreateProjectInput {
  ownerId: string;
  name: string;
  description?: string;
}

export interface AddImageInput {
  ownerId: string;
  projectId: string;
  filename: string;
  operation: ImageOperation;
}
