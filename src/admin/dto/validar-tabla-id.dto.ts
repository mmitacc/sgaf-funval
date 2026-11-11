import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';
import { ValidarTablaDto } from './validar-tablas.dto.js';

export class OnlyIdDto {
  @ApiProperty({
    type: String,
    description: 'El ID único del registro en la tabla',
    example: '1',
  })
  @IsNumberString(
    {},
    { message: 'El ID de la ruta debe ser un número válido.' },
  )
  readonly id: string;
}

// Genera la unión de ambos DTOs manteniendo las propiedades expuestas en Swagger [1]
export class ValidarTablaIdDto extends IntersectionType(
  ValidarTablaDto,
  OnlyIdDto,
) {}
