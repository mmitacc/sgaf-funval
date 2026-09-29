import { PartialType } from '@nestjs/mapped-types';
import { CreateMatriculaDto } from './create-matricula.dto.js';

export class UpdateMatriculaDto extends PartialType(CreateMatriculaDto) {}
