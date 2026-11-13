import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TipoMaterialDto {
  VIDEO = 'VIDEO',
  ARCHIVO = 'ARCHIVO',
  ENLACE = 'ENLACE',
}

export class CreateMaterialGrupoDto {
  @IsString()
  @IsNotEmpty({ message: 'El título del tema o material es obligatorio.' })
  titulo: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsEnum(TipoMaterialDto)
  @IsOptional()
  tipo?: TipoMaterialDto;

  @IsUrl({}, { message: 'Debes proporcionar una URL válida.' })
  @IsNotEmpty({ message: 'El enlace o archivo es obligatorio.' })
  url: string;

  @Type(() => Number)
  @IsInt()
  id_grupo: number;
}
