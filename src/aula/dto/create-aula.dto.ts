import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, IsNotEmpty, Length, IsInt, Min } from 'class-validator';

export class CreateAulaDto {
  @ApiProperty({
    example: 'Aula 201 - Pabellón A',
    description: 'Detalla el nombre del aula',
  })
  @IsString({ message: "El 'nombre' debe ser un texto." })
  @Transform(({ value }) => (typeof value === 'object' ? value.trim() : value))
  @IsNotEmpty({
    message: "El 'nombre' es obligatorio y no debe contener solo espacios.",
  })
  @Length(4, 100, {
    message: "El 'nombre' debe tener entre 4 y 100 caracteres.",
  })
  readonly nombre: string;

  @ApiProperty({
    example: 25,
    description: 'La capacidad del aula en un número entero',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'La capacidad del aula es obligatorio.' })
  @IsInt({ message: 'La capacidad del aula debe ser un numero entero.' })
  @Min(0, { message: 'La capacidad del aula no puede ser negativo.' })
  readonly capacidad: number;
}
