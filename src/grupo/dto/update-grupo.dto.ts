import { PartialType } from '@nestjs/mapped-types';
import { CreateGrupoDto } from './create-grupo.dto.js';

export class UpdateGrupoDto extends PartialType(CreateGrupoDto) {}
