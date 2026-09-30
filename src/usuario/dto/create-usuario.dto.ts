import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  Matches,
  IsEmail,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Rol } from '../../prisma/generated/prisma/enums.js';
import { Estado } from '../../prisma/generated/prisma/enums.js';

export class CreateUsuarioDto {
  @ApiProperty({
    example: 'Jose Luigui',
    description: 'Detalla los nombres del Usuario',
  })
  @IsString({ message: 'Los nombres, deben ser un texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({
    message: 'Los nombres, es obligatorio y no deben contener solo espacios.',
  })
  @Length(4, 100, {
    message: 'Los nombres, deben tener entre 4 y 100 caracteres.',
  })
  readonly nombres: string;

  @ApiProperty({
    example: 'Perez',
    description: 'Detalla los apellidos del Usuario',
  })
  @IsString({ message: 'Los apellidos, deben ser un texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({
    message: 'Los apellidos, es obligatorio y no deben contener solo espacios.',
  })
  @Length(4, 100, {
    message: 'Los apellidos, deben tener entre 4 y 100 caracteres.',
  })
  readonly apellidos: string;

  @ApiProperty({
    example: '+51945789151',
    description: 'Detalla el telefono del Usuario',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const cleaned = value.trim();
      return cleaned === '' ? undefined : cleaned;
    }
    return value;
  })
  @IsString({ message: 'El teléfono debe ser un texto.' })
  @Length(8, 20, {
    message: 'El teléfono debe tener entre 8 y 20 caracteres.', // <- Corregido el número 8
  })
  @Matches(/^\+?[0-9]+$/, {
    message:
      'El teléfono solo debe contener números y opcionalmente el símbolo + al inicio.',
  })
  readonly telefono?: string;

  @ApiProperty({
    example: 'josep@mail.com',
    description: 'Detalla el email del Usuario con el formato correcto',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString({ message: 'El email, debe ser un texto.' })
  @IsNotEmpty({ message: 'El email, es obligatorio.' })
  @IsEmail(
    {},
    {
      message:
        'El email, debe tener un formato correcto (ejemplo@dominio.com).',
    },
  )
  readonly email: string;

  @ApiProperty({
    example: 'mi_password',
    description: 'Detalla la contraseña secreta del Usuario',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: "El 'password' debe ser un texto." })
  @IsNotEmpty({
    message: "El 'password' es obligatorio y no debe contener solo espacios.",
  })
  @Length(6, 255, {
    message: "El 'password' debe tener entre 6 y 255 caracteres.",
  })
  // @Matches(/[a-z]/, {
  //   message: "El 'password' debe contener al menos una letra minúscula.",
  // })
  // @Matches(/[A-Z]/, {
  //   message: "El 'password' debe contener al menos una letra mayúscula.",
  // })
  // @Matches(/[0-9]/, {
  //   message: "El 'password' debe contener al menos un número.",
  // })
  // @Matches(/[!@#$%^&*(),.?":{}|<>_+\-=\[\]\\\/]/, {
  //   message:
  //     "El 'password' debe contener al menos un carácter especial (ejemplo: !@#$%^&*(),.?:{}|<>_+-=[]/).",
  // })
  readonly password: string;

  @ApiProperty({
    example: 'ESTUDIANTE',
    description: 'Detalla el rol de un Usuario',
    enum: Rol,
  })
  @IsOptional()
  @IsEnum(Rol, {
    message: `El rol, debe ser uno de los siguientes valores: ${Object.values(Rol).join(', ')}.`,
  })
  readonly rol?: Rol;

  @ApiProperty({
    example: true,
    description: 'Género masculino del Usuario (true o false).',
  })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsNotEmpty({ message: 'El campo masculino, es obligatorio.' })
  @IsBoolean({
    message: 'El campo masculino, debe ser un valor booleano (true o false).',
  })
  readonly masculino: boolean;

  @ApiProperty({
    example: 'PENDIENTE',
    description:
      'Detalla el estado de un Usuario, sobre la gobernabilidad del sistema.',
    enum: Estado,
  })
  @IsOptional()
  @IsEnum(Estado, {
    message: `El estado, debe ser uno de los siguientes valores: ${Object.values(Rol).join(', ')}.`,
  })
  readonly estado?: Estado;
}
