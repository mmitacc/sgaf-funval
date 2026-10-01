import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsInt,
  Min,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateMateriaDto {
  @ApiProperty({
    example: 'Fisica Quantica',
    description: 'Detalla el nombre de la Materia a cursar',
  })
  @IsString({ message: 'El nombre, debe ser un texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({
    message: 'El nombre, es obligatorio y no debe contener solo espacios.',
  })
  @Length(4, 200, {
    message: 'El nombre, debe tener entre 4 y 200 caracteres.',
  })
  readonly nombre: string;

  @ApiProperty({
    example: 4,
    description: 'Los creditos que vale la Materia cursada.',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Los creditos, es obligatorio.' })
  @IsInt({ message: 'Los creditos, deben ser un numero entero.' })
  @Min(0, { message: 'Los creditos, no pueden ser negativo.' })
  readonly creditos: number;

  @ApiProperty({
    example: 520,
    description: 'La inscripcion, es un monto para inscribirse en una Materia.',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'La inscripcion, es obligatoria.' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'La inscripcion, debe ser un numero con hasta 2 decimales.' },
  )
  @Min(0, { message: 'La inscripcion, no puede ser negativa.' })
  readonly inscripcion: number;

  @ApiProperty({
    example: 520,
    description:
      'La mensualidad, es un monto de costo mensual fijo en una Materia para cursar.',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'La mensualidad, es obligatoria.' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'La mensualidad, debe ser un numero con hasta 2 decimales.' },
  )
  @Min(0, { message: 'La mensualidad, no puede ser negativa.' })
  readonly mensualidad: number;
}
