import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, Min, IsInt } from 'class-validator';

export class CreateMatriculaDto {
  // @ApiProperty({
  //   example: 11,
  //   description:
  //     'El id_estudiante que se matricula a un Grupo con su respectiva Materia Académica.',
  // })
  // @Type(() => Number)
  // @IsNotEmpty({ message: 'El id_estudiante, es obligatorio.' })
  // @IsInt({
  //   message: 'El id_estudiante, debe ser un numero entero.',
  // })
  // @Min(0, { message: 'El id_estudiante, no debe ser negativo.' })
  // readonly id_estudiante: number;

  @ApiProperty({
    example: 3,
    description:
      'El id_grupo que relaciona a la Materia y Profesor, para su respectiva Matricula Académica.',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El id_grupo, es obligatorio.' })
  @IsInt({
    message: 'El id_grupo, debe ser un numero entero.',
  })
  @Min(0, { message: 'El id_grupo, no debe ser negativo.' })
  readonly id_grupo: number;
}
