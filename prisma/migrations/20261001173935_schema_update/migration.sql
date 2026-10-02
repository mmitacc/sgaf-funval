/*
  Warnings:

  - A unique constraint covering the columns `[referencia_externa]` on the table `pago` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matricula` to the `periodo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pago" ADD COLUMN     "referencia_externa" TEXT;

-- AlterTable
ALTER TABLE "periodo" ADD COLUMN     "matricula" DECIMAL(10,2) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "pago_referencia_externa_key" ON "pago"("referencia_externa");
