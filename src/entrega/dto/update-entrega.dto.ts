import { PartialType } from '@nestjs/swagger';
import { CreateEntregaDto } from './create-entrega.dto.js';

export class UpdateEntregaDto extends PartialType(CreateEntregaDto) {}
