export const IMAGE_PROCESSOR = Symbol('IMAGE_PROCESSOR');

export interface ProcessResult {
  resultUrl: string;
}

/**
 * Porta de processamento. O esqueleto usa uma implementação simulada;
 * troque por uma real (ex.: sharp) sem tocar no caso de uso.
 */
export interface ImageProcessor {
  process(input: {
    imageId: string;
    filename: string;
    operation: 'thumbnail' | 'grayscale' | 'resize';
  }): Promise<ProcessResult>;
}
