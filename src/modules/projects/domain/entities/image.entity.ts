export type ImageOperation = 'thumbnail' | 'grayscale' | 'resize';
export type ImageStatus = 'pending' | 'done' | 'failed';

interface ImageProps {
  id: string;
  projectId: string;
  ownerId: string;
  filename: string;
  operation: ImageOperation;
  status: ImageStatus;
  resultUrl?: string;
  createdAt: Date;
}

export class Image {
  private constructor(private props: ImageProps) {}

  static create(props: {
    id: string;
    projectId: string;
    ownerId: string;
    filename: string;
    operation: ImageOperation;
    status?: ImageStatus;
    resultUrl?: string;
    createdAt?: Date;
  }): Image {
    return new Image({
      ...props,
      status: props.status ?? 'pending',
      createdAt: props.createdAt ?? new Date(),
    });
  }

  markProcessed(resultUrl: string): void {
    this.props.status = 'done';
    this.props.resultUrl = resultUrl;
  }
  markFailed(): void {
    this.props.status = 'failed';
  }

  get id() {
    return this.props.id;
  }
  get projectId() {
    return this.props.projectId;
  }
  get ownerId() {
    return this.props.ownerId;
  }
  get filename() {
    return this.props.filename;
  }
  get operation() {
    return this.props.operation;
  }
  get status() {
    return this.props.status;
  }
  get resultUrl() {
    return this.props.resultUrl;
  }
  get createdAt() {
    return this.props.createdAt;
  }

  toJSON() {
    return { ...this.props, createdAt: this.props.createdAt.toISOString() };
  }
}
