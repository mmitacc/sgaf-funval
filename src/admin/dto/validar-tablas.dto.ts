import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { Prisma } from '../../prisma/generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';

// 1. Tipo estricto para TypeScript
export type TablasPrisma = keyof Omit<
  PrismaService,
  | '$connect'
  | '$disconnect'
  | '$executeRaw'
  | '$executeRawUnsafe'
  | '$on'
  | '$queryRaw'
  | '$queryRawUnsafe'
  | '$transaction'
  | '$use'
  | '$extends'
  | '$symbol'
  | '$onModuleInit'
  | '$onModuleDestroy'
>;

// 2. Arreglo dinámico usando el objeto ModelName generado por tu Prisma personalizado
export const LISTA_TABLAS = Object.keys(Prisma.ModelName).map(
  (model) => model.toLowerCase(), // Convierte a minúsculas ('Usuario' -> 'usuario') para coincidir con tu ruta
) as unknown as TablasPrisma[];

// 3. DTO para Swagger y Validación
export class ValidarTablaDto {
  @ApiProperty({
    type: String,
    description: 'El nombre de la tabla de la base de datos',
    example: 'usuario',
    enum: LISTA_TABLAS, // Agrega el menú desplegable dinámico en Swagger UI
  })
  @IsString()
  @IsIn(LISTA_TABLAS, {
    message: (args) =>
      `La tabla '${args.value}' no existe. Opciones válidas: ${LISTA_TABLAS.join(', ')}`,
  })
  tabla: TablasPrisma;
}
