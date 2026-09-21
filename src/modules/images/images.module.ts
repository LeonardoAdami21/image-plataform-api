import { Module } from '@nestjs/common';
import { ProcessImageUseCase } from './application/process-image.usecase';
import { IMAGE_PROCESSOR } from './application/ports/image-processor.port';
import { SimulatedImageProcessor } from './infrastructure/simulated-image.processor';
import { ImageJobConsumer } from './infrastructure/image-job.consumer';

@Module({
  providers: [
    ProcessImageUseCase,
    ImageJobConsumer,
    { provide: IMAGE_PROCESSOR, useClass: SimulatedImageProcessor },
  ],
})
export class ImagesModule {}
