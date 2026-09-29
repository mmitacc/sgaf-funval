/*
  Warnings:

  - You are about to drop the column `cancelado` on the `deuda` table. All the data in the column will be lost.
  - Added the required column `pendiente` to the `deuda` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "deuda_id_estudiante_cancelado_idx";

-- AlterTable
ALTER TABLE "deuda" DROP COLUMN "cancelado",
ADD COLUMN     "moroso" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pendiente" DECIMAL(10,2) NOT NULL;

-- CreateIndex
CREATE INDEX "deuda_id_estudiante_moroso_idx" ON "deuda"("id_estudiante", "moroso");
