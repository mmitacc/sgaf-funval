import { PartialType, PickType } from '@nestjs/swagger';
import {
  CreateEntregaDto,
  CreateEntregaEstudianteDto,
} from './create-entrega.dto.js';

export class UpdateEntregaDto extends PartialType(CreateEntregaEstudianteDto) {}

export class UpdateNotaEstudianteDto extends PickType(CreateEntregaDto, [
  'calificacion',
] as const) {}
