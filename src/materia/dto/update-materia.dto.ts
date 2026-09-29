import { PartialType } from '@nestjs/mapped-types';
import { CreateMateriaDto } from './create-materia.dto.js';

export class UpdateMateriaDto extends PartialType(CreateMateriaDto) {}
