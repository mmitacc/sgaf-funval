import { PartialType } from '@nestjs/mapped-types';
import { CreateEntregaDto } from './create-entrega.dto.js';

export class UpdateEntregaDto extends PartialType(CreateEntregaDto) {}
