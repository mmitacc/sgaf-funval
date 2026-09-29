/*
  Warnings:

  - You are about to drop the column `fecha` on the `matricula` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_pago` on the `pago` table. All the data in the column will be lost.
  - Added the required column `daletedate` to the `aula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `aula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daletedate` to the `deuda` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `deuda` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daletedate` to the `entrega` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `entrega` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daletedate` to the `especialidad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `especialidad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daletedate` to the `estudiante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `estudiante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daletedate` to the `grupo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `grupo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daletedate` to the `horario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `horario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daletedate` to the `materia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `materia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daletedate` to the `matricula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `matricula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daletedate` to the `pago` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `pago` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daletedate` to the `periodo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `periodo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daletedate` to the `profesor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `profesor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daletedate` to the `tarea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `tarea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daletedate` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "aula" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "daletedate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "deuda" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "daletedate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "entrega" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "daletedate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "especialidad" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "daletedate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "estudiante" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "daletedate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "grupo" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "daletedate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "horario" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "daletedate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "materia" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "daletedate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "matricula" DROP COLUMN "fecha",
ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "daletedate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "pago" DROP COLUMN "fecha_pago",
ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "daletedate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "periodo" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "daletedate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "profesor" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "daletedate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "tarea" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "daletedate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "usuario" ADD COLUMN     "daletedate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
