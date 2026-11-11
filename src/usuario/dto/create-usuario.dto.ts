import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  Matches,
  IsEmail,
  IsEnum,
  IsBoolean,
  ValidateIf,
  IsDate,
  MinDate,
  IsInt,
  Min,
} from 'class-validator';
import { Rol, Estado } from '../../prisma/generated/prisma/enums.js';

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
  @Length(2, 100, {
    message: 'Los nombres, deben tener entre 2 y 100 caracteres.',
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
  @Length(2, 100, {
    message: 'Los apellidos, deben tener entre 2 y 100 caracteres.',
  })
  readonly apellidos: string;

  @ApiPropertyOptional({
    example: '+51945789151',
    description: 'Detalla el telefono del Usuario',
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
    message: 'El teléfono debe tener entre 8 y 20 caracteres.',
  })
  @Matches(/^\+?[0-9]+$/, {
    message:
      'El teléfono solo debe contener números y opcionalmente el símbolo + al inicio.',
  })
  readonly telefono?: string;

  @ApiProperty({
    example: 'manu@prisma.edu',
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
    example: '123456',
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
  readonly password: string;

  @ApiProperty({
    example: 'PROFESOR',
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

  @ApiPropertyOptional({
    example:
      'https://res.cloudinary.com/xbemwdg4/image/jkzmijmxahnjbxv0owp0.jpg',
    description: 'URL de la foto del usuario.',
  })
  @IsOptional()
  readonly foto_url?: string;

  @ApiPropertyOptional({
    example: 'ACTIVO',
    description:
      'Detalla el estado de un Usuario, sobre la gobernabilidad del sistema.',
    enum: Estado,
  })
  @IsOptional()
  @IsEnum(Estado, {
    message: `El estado, debe ser uno de los siguientes valores: ${Object.values(Estado).join(', ')}.`,
  })
  readonly estado?: Estado;

  // --- Campos condicionales solo cuando rol === 'PROFESOR' ---
  @ApiPropertyOptional({
    example: '2026-09-29',
    description:
      'Fecha en la que se firma o inicia el contrato (Formato YYYY-MM-DD)',
  })
  @ValidateIf((dto: CreateUsuarioDto) => dto.rol === 'PROFESOR')
  @IsNotEmpty({ message: 'La fecha del contrato, es obligatoria.' })
  @Type(() => Date)
  @IsDate({ message: 'La fecha del contrato, debe ser una fecha válida.' })
  @MinDate(new Date(Date.UTC(2020, 0, 1)), {
    message: 'La fecha del contrato, no puede ser anterior al año 2020.',
  })
  readonly fecha_contrato?: Date;

  @ApiPropertyOptional({
    example: 2,
    description: 'El ID de la Especialidad del Profesor.',
  })
  @ValidateIf((dto: CreateUsuarioDto) => dto.rol === 'PROFESOR')
  @Type(() => Number)
  @IsNotEmpty({ message: 'El id_especialidad, es obligatorio.' })
  @IsInt({ message: 'El id_especialidad, debe ser un numero entero.' })
  @Min(1, { message: 'El id_especialidad, debe ser mayor a 0.' })
  readonly id_especialidad?: number;

  // --- Campo opcional (usado al editar un Estudiante) ---
  @ApiPropertyOptional({
    example: 'Juan Jose Perez Quispe',
    description: 'Detalla el apoderado/tutor del Estudiante',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const cleaned = value.trim();
      return cleaned === '' ? undefined : cleaned;
    }
    return value;
  })
  @IsString({ message: 'El apoderado, debe ser un texto.' })
  @Length(6, 200, {
    message: 'El apoderado, debe tener entre 6 y 200 caracteres.',
  })
  readonly apoderado?: string;
}
