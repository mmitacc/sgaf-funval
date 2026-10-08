import { IntersectionType } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';
import { ValidarTablaDto } from './validar-tablas.dto.js';

export class OnlyIdDto {
  @IsNumberString(
    {},
    { message: 'El ID de la ruta debe ser un número válido.' },
  )
  readonly id: string;
}

export class ValidarTablaIdDto extends IntersectionType(
  ValidarTablaDto,
  OnlyIdDto,
) {}
