import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsString,
  Length,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class CreateEntregaDto {
  @ApiProperty({
    example: 'Respuesta del alumno ID 7 para la tarea ID 1',
    description:
      'Detalla Detalla la respuesta del Estudiante sobre su Tarea. Es opcional',
    required: false,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ValidateIf((dto) => !dto.archivo_url || dto.archivo_url.trim() === '')
  @IsNotEmpty({
    message:
      'Debes llenar al menos uno de los campos: respuesta ó archivo_url.',
  })
  @IsString({ message: 'La respuesta, debe ser un texto válido.' })
  @Length(6, 5000, {
    message: 'La respuesta, debe tener entre 6 y 5000 caracteres.',
  })
  readonly respuesta?: string;

  @ApiProperty({
    example: 'http://www.google.com/$user21dfasd566s/drive/resp-tarea51.doc',
    description:
      'Link del solucionario de la Tarea presentada por el Estudiante.',
    required: false,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ValidateIf((dto) => !dto.respuesta || dto.respuesta.trim() === '')
  @IsNotEmpty({
    message:
      'Debes llenar al menos uno de los campos: respuesta ó archivo_url.',
  })
  @IsString({ message: 'El archivo_url, debe ser un texto válido.' })
  @Length(6, 3000, {
    message: 'El archivo_url, debe tener entre 6 y 3000 caracteres.',
  })
  readonly archivo_url?: string;

  @ApiProperty({
    example: 15,
    description: 'Calificación otorgada por el Profesor(es opcional).',
    required: false,
    minimum: 0,
    maximum: 20,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === null || value === undefined
      ? value
      : Number(value),
  )
  @IsInt({ message: 'La calificación, debe ser un número entero.' })
  @Min(0, { message: 'La calificación, mínima debe ser 0.' })
  @Max(20, { message: 'La calificación, máxima debe ser 20.' })
  readonly calificacion?: number;

  @ApiProperty({
    example: 9,
    description: 'El ID del Estudiante, activo en el Período Academica.',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El id_estudiante, es obligatorio.' })
  @IsInt({ message: 'El id_estudiante, debe ser un numero entero.' })
  @Min(0, { message: 'El id_estudiante, no puede ser negativo.' })
  readonly id_estudiante: number;

  @ApiProperty({
    example: 2,
    description: 'El ID de la Tarea pendiente.',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El id_tarea, es obligatorio.' })
  @IsInt({ message: 'El id_tarea, debe ser un numero entero.' })
  @Min(0, { message: 'El id_tarea, no puede ser negativo.' })
  readonly id_tarea: number;
}
