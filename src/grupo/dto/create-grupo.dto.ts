import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateGrupoDto {
  @ApiProperty({
    example: 25,
    description: 'Detalla la capacidad del grupo en un número entero',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'La capacidad del grupo, es obligatorio.' })
  @IsInt({ message: 'La capacidad del grupo, debe ser un numero entero.' })
  @Min(0, { message: 'La capacidad del grupo, no puede ser negativo.' })
  readonly capacidad: number;

  @ApiProperty({
    example: 2,
    description: 'El ID del Profesor para el Grupo.',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El id_profesor, es obligatorio.' })
  @IsInt({ message: 'El id_profesor, debe ser un numero entero.' })
  @Min(0, { message: 'El id_profesor, no puede ser negativo.' })
  readonly id_profesor: number;

  @ApiProperty({
    example: 2,
    description: 'El ID del Aula para el Grupo.',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El id_aula, es obligatorio.' })
  @IsInt({ message: 'El id_aula, debe ser un numero entero.' })
  @Min(0, { message: 'El id_aula, no puede ser negativo.' })
  readonly id_aula: number;

  @ApiProperty({
    example: 2,
    description: 'El ID de la Materia para el Grupo.',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El id_materia, es obligatorio.' })
  @IsInt({ message: 'El id_materia, debe ser un numero entero.' })
  @Min(0, { message: 'El id_materia, no puede ser negativo.' })
  readonly id_materia: number;

  @ApiProperty({
    example: 2,
    description: 'El ID del Período para el Grupo.',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El id_periodo, es obligatorio.' })
  @IsInt({ message: 'El id_periodo, debe ser un numero entero.' })
  @Min(0, { message: 'El id_periodo, no puede ser negativo.' })
  readonly id_periodo: number;
}
