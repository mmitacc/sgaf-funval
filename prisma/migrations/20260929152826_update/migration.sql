/*
  Warnings:

  - You are about to drop the column `daletedate` on the `aula` table. All the data in the column will be lost.
  - You are about to drop the column `daletedate` on the `deuda` table. All the data in the column will be lost.
  - You are about to drop the column `daletedate` on the `entrega` table. All the data in the column will be lost.
  - You are about to drop the column `daletedate` on the `especialidad` table. All the data in the column will be lost.
  - You are about to drop the column `daletedate` on the `estudiante` table. All the data in the column will be lost.
  - You are about to drop the column `daletedate` on the `grupo` table. All the data in the column will be lost.
  - You are about to drop the column `daletedate` on the `horario` table. All the data in the column will be lost.
  - You are about to drop the column `daletedate` on the `materia` table. All the data in the column will be lost.
  - You are about to drop the column `daletedate` on the `matricula` table. All the data in the column will be lost.
  - You are about to drop the column `daletedate` on the `pago` table. All the data in the column will be lost.
  - You are about to drop the column `daletedate` on the `periodo` table. All the data in the column will be lost.
  - You are about to drop the column `daletedate` on the `profesor` table. All the data in the column will be lost.
  - You are about to drop the column `daletedate` on the `tarea` table. All the data in the column will be lost.
  - You are about to drop the column `daletedate` on the `usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "aula" DROP COLUMN "daletedate",
ADD COLUMN     "deletedate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "deuda" DROP COLUMN "daletedate",
ADD COLUMN     "deletedate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "entrega" DROP COLUMN "daletedate",
ADD COLUMN     "deletedate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "especialidad" DROP COLUMN "daletedate",
ADD COLUMN     "deletedate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "estudiante" DROP COLUMN "daletedate",
ADD COLUMN     "deletedate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "grupo" DROP COLUMN "daletedate",
ADD COLUMN     "deletedate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "horario" DROP COLUMN "daletedate",
ADD COLUMN     "deletedate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "materia" DROP COLUMN "daletedate",
ADD COLUMN     "deletedate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "matricula" DROP COLUMN "daletedate",
ADD COLUMN     "deletedate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "pago" DROP COLUMN "daletedate",
ADD COLUMN     "deletedate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "periodo" DROP COLUMN "daletedate",
ADD COLUMN     "deletedate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "profesor" DROP COLUMN "daletedate",
ADD COLUMN     "deletedate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "tarea" DROP COLUMN "daletedate",
ADD COLUMN     "deletedate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "usuario" DROP COLUMN "daletedate",
ADD COLUMN     "deletedate" TIMESTAMP(3);
