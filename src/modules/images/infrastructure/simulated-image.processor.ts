import { Injectable } from '@nestjs/common';
import {
  ImageProcessor,
  ProcessResult,
} from '../application/ports/image-processor.port';

/**
 * Processador SIMULADO: aguarda um instante e devolve uma URL fictícia.
 * Substitua por uma implementação real (ex.: sharp) mantendo a interface.
 */
@Injectable()
export class SimulatedImageProcessor implements ImageProcessor {
  async process(input: {
    imageId: string;
    filename: string;
    operation: 'thumbnail' | 'grayscale' | 'resize';
  }): Promise<ProcessResult> {
    await new Promise((r) => setTimeout(r, 1500));
    return {
      resultUrl: `https://cdn.local/processed/${input.operation}/${input.imageId}-${input.filename}`,
    };
  }
}
