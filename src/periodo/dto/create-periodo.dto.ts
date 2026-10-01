import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  Min,
  IsString,
  Length,
  IsInt,
  IsDate,
  MinDate,
  IsNumber,
} from 'class-validator';

export class CreatePeriodoDto {
  @ApiProperty({
    example: 'Periodo Regular III - 2026',
    description: 'Detalla el nombre del Período Académico.',
  })
  @IsString({ message: 'El nombre, debe ser un texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({
    message: 'El nombre, es obligatorio y no debe contener solo espacios.',
  })
  @Length(8, 100, {
    message: 'El nombre, debe tener entre 8 y 100 caracteres.',
  })
  readonly nombre: string;

  @ApiProperty({
    example: 3,
    description: 'Los meses que dura el Período Académico.',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Los meses, es obligatorio.' })
  @IsInt({ message: 'Los meses, deben ser un numero entero.' })
  @Min(0, { message: 'Los meses, no pueden ser negativo.' })
  readonly meses: number;

  @ApiProperty({
    example: '2026-09-29',
    description:
      'Fecha en la que se inicia el Período Académico (Formato YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'La fecha de inicio, es obligatoria.' })
  @Type(() => Date)
  @IsDate({ message: 'La fecha de inicio, debe ser una fecha válida.' })
  @MinDate(new Date(Date.UTC(2020, 0, 1)), {
    message: 'La fecha de inicio, no puede ser anterior al año 2020.',
  })
  readonly inicio: Date;

  @ApiProperty({
    example: '2026-12-05',
    description:
      'Fecha en la que se da fin al Período Académico (Formato YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'La fecha de fin, es obligatoria.' })
  @Type(() => Date)
  @IsDate({ message: 'La fecha de fin, debe ser una fecha válida.' })
  @MinDate(new Date(Date.UTC(2020, 0, 1)), {
    message: 'La fecha de fin, debe ser mayor a la fecha de inicio.',
  })
  readonly fin: Date;

  @ApiProperty({
    example: 3,
    description:
      'El número máximo de creditos que contempla el Período Académico.',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El número máximo de creditos, es obligatorio.' })
  @IsInt({
    message: 'El número máximo de creditos, debe ser un numero entero.',
  })
  @Min(0, { message: 'El número máximo de creditos, no debe ser negativo.' })
  readonly max_creditos: number;

  @ApiProperty({
    example: 100,
    description:
      'El monto de la matricula, es la cantidad de pago para estudiar en el Período Académico.',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El monto de la matricula, es obligatoria.' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'El monto de la matricula, debe ser un numero con hasta 2 decimales.',
    },
  )
  @Min(0, { message: 'El monto de la matricula, no puede ser negativo.' })
  readonly matricula: number;
}
