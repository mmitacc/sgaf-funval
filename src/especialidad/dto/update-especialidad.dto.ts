import { PartialType } from '@nestjs/swagger';
import { CreateEspecialidadDto } from './create-especialidad.dto.js';

export class UpdateEspecialidadDto extends PartialType(CreateEspecialidadDto) {}
