import { PartialType } from '@nestjs/swagger';
import { CreateMaterialGrupoDto } from './create-material-grupo.dto.js';

export class UpdateMaterialGrupoDto extends PartialType(CreateMaterialGrupoDto) {}
