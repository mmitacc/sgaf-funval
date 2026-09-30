import { PartialType, IntersectionType, OmitType } from '@nestjs/swagger';
import { CreateProfesorDto } from './create-profesor.dto.js';
import { CreateUsuarioDto } from '../../usuario/dto/create-usuario.dto.js';

export class UpdateProfesorDto extends PartialType(
  IntersectionType(
    OmitType(CreateUsuarioDto, ['rol', 'estado'] as const),
    CreateProfesorDto,
  ),
) {}
