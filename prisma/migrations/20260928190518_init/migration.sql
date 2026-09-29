-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ESTUDIANTE', 'PROFESOR', 'RECEPCIONISTA', 'ADMINISTRADOR', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('PENDIENTE', 'ACTIVO', 'SUSPENDIDO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('EFECTIVO', 'TRANSFERENCIA', 'ONLINE');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(20),
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "rol" "Rol" NOT NULL,
    "masculino" BOOLEAN NOT NULL DEFAULT true,
    "estado" "EstadoUsuario" NOT NULL DEFAULT 'PENDIENTE',
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "especialidad" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "especialidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profesor" (
    "id_usuario" INTEGER NOT NULL,
    "fecha_contrato" TIMESTAMP(3) NOT NULL,
    "id_especialidad" INTEGER NOT NULL,

    CONSTRAINT "profesor_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "estudiante" (
    "id_usuario" INTEGER NOT NULL,
    "codigo" VARCHAR(20) NOT NULL,
    "apoderado" VARCHAR(200),

    CONSTRAINT "estudiante_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "periodo" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "meses" INTEGER NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fin" TIMESTAMP(3) NOT NULL,
    "max_creditos" INTEGER NOT NULL,

    CONSTRAINT "periodo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materia" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "creditos" INTEGER NOT NULL,
    "inscripcion" DECIMAL(10,2) NOT NULL,
    "mensualidad" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "materia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aula" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "capacidad" INTEGER NOT NULL,

    CONSTRAINT "aula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horario" (
    "id" SERIAL NOT NULL,
    "dia" VARCHAR(50) NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fin" TIME NOT NULL,
    "id_grupo" INTEGER NOT NULL,

    CONSTRAINT "horario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupo" (
    "id" SERIAL NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "id_profesor" INTEGER NOT NULL,
    "id_aula" INTEGER NOT NULL,
    "id_materia" INTEGER NOT NULL,
    "id_periodo" INTEGER NOT NULL,

    CONSTRAINT "grupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matricula" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_estudiante" INTEGER NOT NULL,
    "id_grupo" INTEGER NOT NULL,

    CONSTRAINT "matricula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarea" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "instrucciones" TEXT NOT NULL,
    "fecha_entrega" TIMESTAMP(3) NOT NULL,
    "id_grupo" INTEGER NOT NULL,

    CONSTRAINT "tarea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entrega" (
    "id" SERIAL NOT NULL,
    "respuesta" TEXT NOT NULL,
    "archivo_url" VARCHAR,
    "calificacion" INTEGER,
    "id_estudiante" INTEGER NOT NULL,
    "id_tarea" INTEGER NOT NULL,

    CONSTRAINT "entrega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deuda" (
    "id" SERIAL NOT NULL,
    "total_deuda" DECIMAL(10,2) NOT NULL,
    "deuda_mes" DECIMAL(10,2) NOT NULL,
    "cancelado" BOOLEAN NOT NULL DEFAULT false,
    "id_periodo" INTEGER NOT NULL,
    "id_estudiante" INTEGER NOT NULL,

    CONSTRAINT "deuda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pago" (
    "id" SERIAL NOT NULL,
    "concepto" VARCHAR(100) NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "tipo_pago" "TipoPago" NOT NULL,
    "estado_pago" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "fecha_pago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_operador" INTEGER,
    "id_estudiante" INTEGER NOT NULL,
    "id_deuda" INTEGER,

    CONSTRAINT "pago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "especialidad_nombre_key" ON "especialidad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "estudiante_codigo_key" ON "estudiante"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "aula_nombre_key" ON "aula"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "matricula_id_estudiante_id_grupo_key" ON "matricula"("id_estudiante", "id_grupo");

-- CreateIndex
CREATE INDEX "deuda_id_estudiante_cancelado_idx" ON "deuda"("id_estudiante", "cancelado");

-- AddForeignKey
ALTER TABLE "profesor" ADD CONSTRAINT "profesor_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profesor" ADD CONSTRAINT "profesor_id_especialidad_fkey" FOREIGN KEY ("id_especialidad") REFERENCES "especialidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estudiante" ADD CONSTRAINT "estudiante_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horario" ADD CONSTRAINT "horario_id_grupo_fkey" FOREIGN KEY ("id_grupo") REFERENCES "grupo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo" ADD CONSTRAINT "grupo_id_profesor_fkey" FOREIGN KEY ("id_profesor") REFERENCES "profesor"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo" ADD CONSTRAINT "grupo_id_aula_fkey" FOREIGN KEY ("id_aula") REFERENCES "aula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo" ADD CONSTRAINT "grupo_id_materia_fkey" FOREIGN KEY ("id_materia") REFERENCES "materia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo" ADD CONSTRAINT "grupo_id_periodo_fkey" FOREIGN KEY ("id_periodo") REFERENCES "periodo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matricula" ADD CONSTRAINT "matricula_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiante"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matricula" ADD CONSTRAINT "matricula_id_grupo_fkey" FOREIGN KEY ("id_grupo") REFERENCES "grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarea" ADD CONSTRAINT "tarea_id_grupo_fkey" FOREIGN KEY ("id_grupo") REFERENCES "grupo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entrega" ADD CONSTRAINT "entrega_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiante"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entrega" ADD CONSTRAINT "entrega_id_tarea_fkey" FOREIGN KEY ("id_tarea") REFERENCES "tarea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deuda" ADD CONSTRAINT "deuda_id_periodo_fkey" FOREIGN KEY ("id_periodo") REFERENCES "periodo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deuda" ADD CONSTRAINT "deuda_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiante"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_id_operador_fkey" FOREIGN KEY ("id_operador") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiante"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_id_deuda_fkey" FOREIGN KEY ("id_deuda") REFERENCES "deuda"("id") ON DELETE SET NULL ON UPDATE CASCADE;
