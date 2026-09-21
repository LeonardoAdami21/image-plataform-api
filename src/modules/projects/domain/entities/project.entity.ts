import { Image, ImageOperation } from './image.entity';

interface ProjectProps {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  createdAt: Date;
  images: Image[];
}

export class Project {
  private constructor(private props: ProjectProps) {}

  static create(props: {
    id: string;
    ownerId: string;
    name: string;
    description?: string;
    createdAt?: Date;
    images?: Image[];
  }): Project {
    if (!props.name || props.name.trim().length < 2) {
      throw new Error('Nome do projeto deve ter ao menos 2 caracteres.');
    }
    return new Project({
      id: props.id,
      ownerId: props.ownerId,
      name: props.name.trim(),
      description: props.description?.trim() ?? '',
      createdAt: props.createdAt ?? new Date(),
      images: props.images ?? [],
    });
  }

  addImage(props: {
    id: string;
    filename: string;
    operation: ImageOperation;
  }): Image {
    const image = Image.create({
      id: props.id,
      projectId: this.id,
      ownerId: this.ownerId,
      filename: props.filename,
      operation: props.operation,
    });
    this.props.images.push(image);
    return image;
  }

  get id() {
    return this.props.id;
  }
  get ownerId() {
    return this.props.ownerId;
  }
  get name() {
    return this.props.name;
  }
  get description() {
    return this.props.description;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get images() {
    return [...this.props.images];
  }

  toReadModel() {
    return {
      id: this.id,
      ownerId: this.ownerId,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt.toISOString(),
      images: this.images.map((i) => i.toJSON()),
    };
  }
}
