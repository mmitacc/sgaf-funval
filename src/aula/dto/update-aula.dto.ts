import { PartialType } from '@nestjs/swagger';
import { CreateAulaDto } from './create-aula.dto.js';

export class UpdateAulaDto extends PartialType(CreateAulaDto) {}
