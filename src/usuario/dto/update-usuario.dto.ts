import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto.js';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}

export class UpdatePerfilDto extends PickType(CreateUsuarioDto, [
  'nombres',
  'apellidos',
  'telefono',
  'foto_url',
]) {}
