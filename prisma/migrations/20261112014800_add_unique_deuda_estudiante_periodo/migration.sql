/*
  Warnings:

  - A unique constraint covering the columns `[id_estudiante,id_periodo]` on the table `deuda` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "deuda_id_estudiante_id_periodo_key" ON "deuda"("id_estudiante", "id_periodo");
