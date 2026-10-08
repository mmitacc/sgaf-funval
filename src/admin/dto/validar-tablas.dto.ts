import { PrismaService } from '../../prisma/prisma.service.js';
import { IsIn, IsString } from 'class-validator';

// 1. Tipo estricto para TypeScript (en tiempo de compilación)
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

// 2. Arreglo para class-validator (en tiempo de ejecución)
// Obtenemos las propiedades del prototipo de la clase PrismaService
export const LISTA_TABLAS = Object.getOwnPropertyNames(
  PrismaService.prototype,
).filter(
  (prop) => !prop.startsWith('$') && prop !== 'constructor',
) as TablasPrisma[];

// 3. Generamos el DTO para validar las tablas que pertenezcan a la BD
export class ValidarTablaDto {
  @IsString()
  @IsIn(LISTA_TABLAS, {
    message: (args) =>
      `La tabla '${args.value}' no existe. Opciones válidas: ${LISTA_TABLAS.join(', ')}`,
  })
  tabla: TablasPrisma;
}
