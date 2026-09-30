import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateEspecialidadDto {
  @ApiProperty({
    example: 'Fisica Quantica',
    description: 'Detalla el nombre de la Especialidad del Profesor',
  })
  @IsString({ message: 'El nombre, debe ser un texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({
    message: 'El nombre, es obligatorio y no debe contener solo espacios.',
  })
  @Length(4, 100, {
    message: 'El nombre, debe tener entre 4 y 100 caracteres.',
  })
  readonly nombre: string;
}
