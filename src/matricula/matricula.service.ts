import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateMatriculaDto } from './dto/update-matricula.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { VALIDATE_MATRICULA_ESTUDIANTE } from './queries/validar-matricula.query.js';
import { REGISTRAR_DEUDA_ESTUDIANTE } from './queries/registrar-deuda.query.js';

@Injectable()
export class MatriculaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: any, id_grupo: number) {
    // 1. Validar que el usuario exista, esté activo, sea ESTUDIANTE y tenga perfil
    const estudiante = await this.prisma.usuario.findFirst({
      where: {
        id: user.id,
        deleted: false,
        rol: 'ESTUDIANTE',
        estudiante: { isNot: null }, // ✅ Corregido (Estudiante no tiene campo deleted)
      },
    });

    if (!estudiante) {
      throw new BadRequestException({
        success: false,
        message: `El usuario ID=${user.id} no es un estudiante activo válido.`,
      });
    }

    // 2. Ejecutar validación, matrícula y cobro dentro de una transacción atómica
    return await this.prisma.$transaction(async (tx) => {
      const result = await tx.$queryRaw<any[]>(
        VALIDATE_MATRICULA_ESTUDIANTE(user.id, id_grupo),
      );
      const status = result[0];

      // Si no se creó la matrícula, armamos los motivos y abortamos
      if (!status?.id_matricula_creada) {
        const motivos: string[] = [];

        if (!status?.grupo_valido) {
          motivos.push('El grupo seleccionado no existe o no está disponible.');
        } else {
          if (status.error_capacidad)
            motivos.push('El grupo alcanzó su capacidad máxima.');
          if (status.error_creditos)
            motivos.push(
              'La suma de créditos supera el límite permitido para el periodo.',
            );
          if (status.error_materia)
            motivos.push(
              'El estudiante ya está inscrito en esta materia dentro del mismo periodo.',
            );
          if (status.error_horario)
            motivos.push(
              'Existe un traslape de horario con otro grupo ya inscrito.',
            );
        }

        throw new BadRequestException({
          success: false,
          message: 'Inscripción rechazada por reglas de negocio.',
          errores: motivos,
        });
      }

      // 3. Actualizar la deuda existente en el periodo
      const deudaResult = await tx.$queryRaw<any[]>(
        REGISTRAR_DEUDA_ESTUDIANTE(user.id, id_grupo),
      );

      // Si deudaResult está vacío, no existía fila previa en tabla 'deuda': revertimos todo
      if (!deudaResult.length) {
        throw new BadRequestException({
          success: false,
          message:
            'El estudiante no tiene una cuenta de deuda habilitada para este periodo.',
        });
      }

      return {
        success: true,
        message: 'Inscripción realizada con éxito.',
        idMatricula: Number(status.id_matricula_creada),
        deudaActualizada: deudaResult[0],
      };
    });
  }

  async findAll() {
    return await this.prisma.matricula.findMany({ where: { deleted: false } });
  }

  async findOne(id: number) {
    const matricula = await this.prisma.matricula.findFirst({
      where: { id, deleted: false },
    });

    if (!matricula) {
      throw new NotFoundException(`Matrícula con ID=${id} no encontrada.`);
    }

    return matricula;
  }

  async update(id: number, updateMatriculaDto: UpdateMatriculaDto) {
    await this.findOne(id); // ✅ Valida que exista antes de actualizar
    return await this.prisma.matricula.update({
      where: { id },
      data: updateMatriculaDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // ✅ Valida que exista antes de eliminar
    return await this.prisma.matricula.update({
      where: { id },
      data: { deleted: true, deletedate: new Date() },
    });
  }

  async obtenerPorEstudiante(usuarioId: number) {
    return this.prisma.matricula.findMany({
      where: {
        id_estudiante: usuarioId,
        deleted: false,
      },
      include: {
        grupo: {
          include: {
            materia: {
              select: {
                id: true,
                nombre: true,
                creditos: true,
                mensualidad: true,
              },
            },
            periodo: {
              select: {
                id: true,
                nombre: true,
                max_creditos: true,
              },
            },
            profesor: {
              select: {
                id_usuario: true,
                usuario: {
                  select: {
                    nombres: true,
                    apellidos: true,
                  },
                },
              },
            },
            aula: {
              select: {
                id: true,
                nombre: true,
              },
            },
            horarios: {
              where: { deleted: false },
              select: {
                id: true,
                dia: true,
                hora_inicio: true,
                hora_fin: true,
              },
            },
            tareas: {
              where: { deleted: false },
              select: {
                id: true,
                nombre: true,
                instrucciones: true, // <-- Agregado para el Aula Virtual
                fecha_entrega: true,
                entregas: {
                  where: {
                    id_estudiante: usuarioId,
                    deleted: false,
                  },
                  select: {
                    id: true,
                    respuesta: true, // <-- Agregado para precargar entrega
                    archivo_url: true, // <-- Agregado para ver/descargar archivo
                    calificacion: true,
                    created: true,
                    updated: true,
                  },
                },
              },
              orderBy: {
                fecha_entrega: 'asc',
              },
            },
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }
}
