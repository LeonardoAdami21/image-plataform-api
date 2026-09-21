import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Campanha de Verão' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @ApiProperty({ required: false, example: 'Banners e thumbnails' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
