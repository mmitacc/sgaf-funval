import { ApiProperty, IntersectionType, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, Length } from 'class-validator';
import { CreateUsuarioDto } from '../../usuario/dto/create-usuario.dto.js';

export class CamposSoloEstudianteDto {
  // @ApiProperty({
  //   example: 'MAT-2026-009',
  //   description: 'Detalla el Código de Matricula del Estudiante',
  // })
  // @IsString({ message: 'El codigo, debe ser un texto.' })
  // @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  // @IsNotEmpty({
  //   message: 'El codigo, es obligatorio y no debe contener solo espacios.',
  // })
  // @Length(6, 20, {
  //   message: 'El codigo, debe tener entre 6 y 20 caracteres.',
  // })
  // readonly codigo: string;

  @ApiProperty({
    example: 'Juan Jose Perez Quispe',
    description: 'Detalla el apoderado/tutor del Estudiante',
  })
  @IsString({ message: 'El apoderado, debe ser un texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({
    message: 'El apoderado, es obligatorio y no debe contener solo espacios.',
  })
  @Length(6, 200, {
    message: 'El apoderado, debe tener entre 6 y 200 caracteres.',
  })
  readonly apoderado: string;
}

export class CreateEstudianteDto extends IntersectionType(
  OmitType(CreateUsuarioDto, ['rol', 'estado', 'datosProfesor'] as const),
  CamposSoloEstudianteDto,
) {}
