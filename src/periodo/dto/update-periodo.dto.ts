import { PartialType } from '@nestjs/mapped-types';
import { CreatePeriodoDto } from './create-periodo.dto.js';

export class UpdatePeriodoDto extends PartialType(CreatePeriodoDto) {}
