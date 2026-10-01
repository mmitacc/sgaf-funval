/*
  Warnings:

  - You are about to drop the column `created` on the `estudiante` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `estudiante` table. All the data in the column will be lost.
  - You are about to drop the column `deletedate` on the `estudiante` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `estudiante` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `profesor` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `profesor` table. All the data in the column will be lost.
  - You are about to drop the column `deletedate` on the `profesor` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `profesor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "estudiante" DROP COLUMN "created",
DROP COLUMN "deleted",
DROP COLUMN "deletedate",
DROP COLUMN "updated";

-- AlterTable
ALTER TABLE "profesor" DROP COLUMN "created",
DROP COLUMN "deleted",
DROP COLUMN "deletedate",
DROP COLUMN "updated";
