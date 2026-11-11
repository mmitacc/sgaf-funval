import { OmitType, PartialType, PickType } from '@nestjs/swagger';
import { CreateEstudianteDto } from './create-estudiante.dto.js';

export class UpdateEstudianteDto extends PartialType(
  OmitType(CreateEstudianteDto, ['password'] as const),
) {}
