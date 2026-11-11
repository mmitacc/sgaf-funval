import { PartialType, PickType, OmitType } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto.js';

export class UpdateUsuarioDto extends PartialType(
  OmitType(CreateUsuarioDto, ['password'] as const),
) {}

export class UpdatePerfilDto extends PickType(CreateUsuarioDto, [
  'nombres',
  'apellidos',
  'telefono',
  'foto_url',
]) {}
