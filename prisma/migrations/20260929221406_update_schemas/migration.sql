/*
  Warnings:

  - The `estado` column on the `usuario` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('PENDIENTE', 'ACTIVO', 'SUSPENDIDO', 'INACTIVO');

-- AlterTable
ALTER TABLE "usuario" DROP COLUMN "estado",
ADD COLUMN     "estado" "Estado" NOT NULL DEFAULT 'PENDIENTE';

-- DropEnum
DROP TYPE "EstadoUsuario";
