/*
  Warnings:

  - Changed the type of `dia` on the `horario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Dia" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO');

-- AlterTable
ALTER TABLE "horario" DROP COLUMN "dia",
ADD COLUMN     "dia" "Dia" NOT NULL;
