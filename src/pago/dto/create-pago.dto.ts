import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  Min,
  IsNumber,
  IsString,
  Length,
  IsInt,
  IsOptional,
} from 'class-validator';
import { TipoPago, EstadoPago } from '../../prisma/generated/prisma/enums.js';

export class CreatePagoDto {
  @ApiProperty({
    example: 'Mensualidad Setiembre-2026',
    description:
      'Detalla el concepto de un pago de matricula, inscripción, mesualidad, etc.',
  })
  @IsString({ message: 'El concepto, debe ser un texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({
    message: 'El concepto, es obligatorio y no debe contener solo espacios.',
  })
  @Length(4, 100, {
    message: 'El concepto, debe tener entre 4 y 100 caracteres.',
  })
  readonly concepto: string;

  @ApiProperty({
    example: 520,
    description:
      'El monto, es la cantidad de pago a realizar y en caso de ser una mensualidad es exacto a la deuda en el Período del Estudiante.',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El monto, es obligatoria.' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El monto, debe ser un numero con hasta 2 decimales.' },
  )
  @Min(0, { message: 'El monto, no puede ser negativo.' })
  readonly monto: number;

  @ApiProperty({
    example: 'ONLINE',
    description: 'El tipo de pago, con que se hace la entrega del dinero',
    enum: TipoPago,
  })
  @IsEnum(TipoPago, {
    message: `El tipo_pago, debe ser uno de los siguientes valores: ${Object.values(TipoPago).join(', ')}.`,
  })
  readonly tipo_pago: TipoPago;

  @ApiProperty({
    example: 'RECHAZADO',
    description:
      'El estado de pago, en el que actualmente se encuentra el proceso.',
    enum: EstadoPago,
  })
  @IsEnum(EstadoPago, {
    message: `El estado_pago, debe ser uno de los siguientes valores: ${Object.values(EstadoPago).join(', ')}.`,
  })
  readonly estado_pago: EstadoPago;

  @ApiProperty({
    example: 9,
    description: 'El ID del Estudiante, activo en el Período Academica.',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El id_estudiante, es obligatorio.' })
  @IsInt({ message: 'El id_estudiante, debe ser un numero entero.' })
  @Min(0, { message: 'El id_estudiante, no puede ser negativo.' })
  readonly id_estudiante: number;

//   @ApiProperty({
//     example: 3,
//     description: 'El ID del Operador, que recepciona/procesa el pago.',
//   })
//   @IsOptional()
//   @Type(() => Number)
//   @IsInt({ message: 'El id_operador, debe ser un numero entero.' })
//   @Min(0, { message: 'El id_operador, no puede ser negativo.' })
//   readonly id_operador?: number;

  @ApiProperty({
    example: 3,
    description:
      'El ID de la Deuda total registrada al inicio del Período Academico.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El id_deuda, debe ser un numero entero.' })
  @Min(0, { message: 'El id_deuda, no puede ser negativo.' })
  readonly id_deuda?: number;
}
