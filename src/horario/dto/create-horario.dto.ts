import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsInt, Min, Matches } from 'class-validator';
import { Dia } from '../../prisma/generated/prisma/enums.js';

export class CreateHorarioDto {
  @ApiProperty({
    example: 'MARTES',
    description: 'Día de la semana en que se daran las clases',
    enum: Dia,
  })
  @IsEnum(Dia, {
    message: `El dia, debe ser uno de los siguientes valores: ${Object.values(Dia).join(', ')}.`,
  })
  readonly dia: Dia;

  @ApiProperty({
    example: '16:30',
    description:
      'La hora_inicio del horario de la materia, esta en formato de 24 horas, estándar internacional ISO 8601',
  })
  @IsNotEmpty({ message: 'La hora_inicio, es obligatorio.' })
  @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5]\d$/, {
    message: 'La hora_inicio, debe tener el formato HH:MM (24h).',
  })
  readonly hora_inicio: string;

  @ApiProperty({
    example: '16:30',
    description:
      'La hora_fin del horario de la materia, esta en formato de 24 horas, estándar internacional ISO 8601',
  })
  @IsNotEmpty({ message: 'La hora_fin, es obligatorio.' })
  @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5]\d$/, {
    message: 'La hora_fin, debe tener el formato HH:MM (24h).',
  })
  readonly hora_fin: string;

  @ApiProperty({
    example: 2,
    description: 'El ID de la del Grupo que tiene ese horario.',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El id_grupo, es obligatorio.' })
  @IsInt({ message: 'El id_grupo, debe ser un numero entero.' })
  @Min(0, { message: 'El id_grupo, no puede ser negativo.' })
  readonly id_grupo: number;
}
