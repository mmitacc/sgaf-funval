import { ApiProperty, IntersectionType, OmitType } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty, Min, MinDate } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUsuarioDto } from '../../usuario/dto/create-usuario.dto.js';

export class CamposSoloProfesorDto {
  @ApiProperty({
    example: '2026-09-29',
    description:
      'Fecha en la que se firma o inicia el contrato (Formato YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'La fecha del contrato, es obligatoria.' })
  @Type(() => Date)
  @IsDate({ message: 'La fecha del contrato, debe ser una fecha válida.' })
  @MinDate(new Date('2020-01-01'), {
    message: 'La fecha del contrato, no puede ser anterior al año 2020.',
  })
  readonly fecha_contrato: Date;

  @ApiProperty({
    example: 2,
    description: 'El ID de la Especialidad del Profesor.',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El id_especialidad, es obligatorio.' })
  @IsInt({ message: 'El id_especialidad, debe ser un numero entero.' })
  @Min(0, { message: 'El id_especialidad, no puede ser negativo.' })
  readonly id_especialidad: number;
}

export class CreateProfesorDto extends IntersectionType(
  OmitType(CreateUsuarioDto, ['rol', 'estado'] as const),
  CamposSoloProfesorDto,
) {}
