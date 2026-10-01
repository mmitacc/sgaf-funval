import { PartialType } from '@nestjs/swagger';
import { CreateMatriculaDto } from './create-matricula.dto.js';

export class UpdateMatriculaDto extends PartialType(CreateMatriculaDto) {}
