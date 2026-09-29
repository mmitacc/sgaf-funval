import { PartialType } from '@nestjs/mapped-types';
import { CreateProfesorDto } from './create-profesor.dto.js';

export class UpdateProfesorDto extends PartialType(CreateProfesorDto) {}
