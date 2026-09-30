import { PartialType } from '@nestjs/swagger';
import { CreateDeudaDto } from './create-deuda.dto.js';

export class UpdateDeudaDto extends PartialType(CreateDeudaDto) {}
