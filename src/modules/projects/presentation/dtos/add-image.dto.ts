import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, MinLength } from 'class-validator';

export class AddImageDto {
  @ApiProperty({ example: 'foto.jpg' })
  @IsString()
  @MinLength(1)
  filename!: string;

  @ApiProperty({ enum: ['thumbnail', 'grayscale', 'resize'], example: 'thumbnail' })
  @IsIn(['thumbnail', 'grayscale', 'resize'])
  operation!: 'thumbnail' | 'grayscale' | 'resize';
}
