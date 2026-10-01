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
} from 'class-validator';

export class CreateTareaDto {
  @ApiProperty({
    example: 'Tarea 1 - Algebra I - polinomios',
    description: 'Detalla el nombre de la Tarea Académica.',
  })
  @IsString({ message: 'El nombre, debe ser un texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({
    message: 'El nombre, es obligatorio y no debe contener solo espacios.',
  })
  @Length(8, 200, {
    message: 'El nombre, debe tener entre 8 y 200 caracteres.',
  })
  readonly nombre: string;

  @ApiProperty({
    example: 'Se debe presentar los siguientes ejercicios...',
    description: 'Detalla las instrucciones de la Tarea Académica.',
  })
  @IsString({ message: 'Las instrucciones, deben ser un texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({
    message:
      'Las instrucciones, es obligatoria y no deben contener solo espacios.',
  })
  @Length(8, 2000, {
    message: 'Las instrucciones, debe tener entre 8 y 2000 caracteres.',
  })
  readonly instrucciones: string;

  @ApiProperty({
    example: '2026-10-02',
    description:
      'Fecha máxima de entrega de la Tarea Académica (Formato YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'La fecha de entrega, es obligatoria.' })
  @Type(() => Date)
  @IsDate({ message: 'La fecha de entrega, debe ser una fecha válida.' })
  @MinDate(new Date(), {
    message: 'La fecha de entrega, no puede ser menor al día del registro.',
  })
  readonly fecha_entrega: Date;

  @ApiProperty({
    example: 3,
    description:
      'El id_grupo que relaciona a la Materia y Profesor que imparte la Tarea Académica.',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El id_grupo, es obligatorio.' })
  @IsInt({
    message: 'El id_grupo, debe ser un numero entero.',
  })
  @Min(0, { message: 'El id_grupo, no debe ser negativo.' })
  readonly id_grupo: number;
}
