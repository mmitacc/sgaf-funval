import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsInt, Min, IsNumber, IsBoolean } from 'class-validator';

export class CreateDeudaDto {
  @ApiProperty({
    example: 1560,
    description:
      'El total_deuda, es el monto total de la deuda de un Estudiante en un Período',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El total_deuda, es obligatorio.' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El total_deuda, debe ser un numero con hasta 2 decimales.' },
  )
  @Min(0, { message: 'El total_deuda, no puede ser negativo.' })
  readonly total_deuda: number;

  @ApiProperty({
    example: 1040,
    description:
      'El monto pendiente, es el monto pendiente decreciente a la fecha de la deuda de un Estudiante en un Período. Cuando sea 0 el Estudiante habra terminado de cancelar toda su deuda.',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El monto pendiente, es obligatorio.' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'El monto pendiente, debe ser un numero con hasta 2 decimales.',
    },
  )
  @Min(0, { message: 'El monto pendiente, no puede ser negativo.' })
  readonly pendiente: number;

  @ApiProperty({
    example: 520,
    description:
      'La deuda_mes, es el monto pendiente de la cuota mensual del Período Académico.',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'La deuda_mes, es obligatoria.' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'La deuda_mes, debe ser un numero con hasta 2 decimales.' },
  )
  @Min(0, { message: 'La deuda_mes, no puede ser negativa.' })
  readonly deuda_mes: number;

  @ApiProperty({
    example: true,
    description:
      'Estudiante con morosidad en el Período Academico, o deuda pendiente sin pago en el mes.',
  })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsNotEmpty({ message: 'El campo moroso, es obligatorio.' })
  @IsBoolean({
    message: 'El campo moroso, debe ser un valor booleano (true o false).',
  })
  readonly moroso: boolean;

  @ApiProperty({
    example: 2,
    description: 'El ID del Período Academico, es número un entero',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El id_periodo, es obligatorio.' })
  @IsInt({ message: 'El id_periodo, debe ser un numero entero.' })
  @Min(0, { message: 'El id_periodo, no puede ser negativo.' })
  readonly id_periodo: number;

  @ApiProperty({
    example: 2,
    description: 'El ID del Estudiante, activo en el Período Academica.',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El id_estudiante, es obligatorio.' })
  @IsInt({ message: 'El id_estudiante, debe ser un numero entero.' })
  @Min(0, { message: 'El id_estudiante, no puede ser negativo.' })
  readonly id_estudiante: number;
}
