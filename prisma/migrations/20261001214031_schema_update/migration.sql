/*
  Warnings:

  - The values [INSCRIPCION] on the enum `ConceptoPago` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ConceptoPago_new" AS ENUM ('MATRICULA', 'MENSUALIDAD', 'OTROS');
ALTER TABLE "pago" ALTER COLUMN "concepto" TYPE "ConceptoPago_new" USING ("concepto"::text::"ConceptoPago_new");
ALTER TYPE "ConceptoPago" RENAME TO "ConceptoPago_old";
ALTER TYPE "ConceptoPago_new" RENAME TO "ConceptoPago";
DROP TYPE "public"."ConceptoPago_old";
COMMIT;
