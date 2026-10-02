/*
  Warnings:

  - Added the required column `descripcion` to the `pago` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `concepto` on the `pago` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ConceptoPago" AS ENUM ('MATRICULA', 'INSCRIPCION', 'MENSUALIDAD');

-- AlterTable
ALTER TABLE "pago" ADD COLUMN     "descripcion" VARCHAR(100) NOT NULL,
DROP COLUMN "concepto",
ADD COLUMN     "concepto" "ConceptoPago" NOT NULL;
