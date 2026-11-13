-- CreateEnum
CREATE TYPE "TipoMaterial" AS ENUM ('VIDEO', 'ARCHIVO', 'ENLACE');

-- CreateTable
CREATE TABLE "materiales_grupo" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "tipo" "TipoMaterial" NOT NULL DEFAULT 'ENLACE',
    "url" TEXT NOT NULL,
    "id_grupo" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedate" TIMESTAMP(3),

    CONSTRAINT "materiales_grupo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "materiales_grupo" ADD CONSTRAINT "materiales_grupo_id_grupo_fkey" FOREIGN KEY ("id_grupo") REFERENCES "grupo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
