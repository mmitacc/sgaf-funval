import { PartialType } from '@nestjs/mapped-types';
import { CreateEspecialidadDto } from './create-especialidad.dto.js';

export class UpdateEspecialidadDto extends PartialType(CreateEspecialidadDto) {}
