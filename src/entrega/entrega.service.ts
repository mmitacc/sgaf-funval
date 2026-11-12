import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEntregaEstudianteDto } from './dto/create-entrega.dto.js';
import {
  UpdateEntregaDto,
  UpdateNotaEstudianteDto,
} from './dto/update-entrega.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class EntregaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    user: any,
    createEntregaEstudianteDto: CreateEntregaEstudianteDto,
  ) {
    const idEstudiante = Number(user.id ?? user.sub);
    const { id_tarea, respuesta, archivo_url } = createEntregaEstudianteDto;

    if (!respuesta?.trim() && !archivo_url) {
      throw new BadRequestException(
        'Debes enviar una respuesta de texto o adjuntar un archivo.',
      );
    }

    // 1. Verificar que la tarea exista y el estudiante esté matriculado en su grupo
    const tarea = await this.prisma.tarea.findFirst({
      where: { id: id_tarea, deleted: false },
      include: {
        grupo: {
          include: {
            matriculas: {
              where: { id_estudiante: idEstudiante, deleted: false },
            },
          },
        },
      },
    });

    if (!tarea) {
      throw new NotFoundException('La tarea especificada no existe.');
    }

    if (tarea.grupo.matriculas.length === 0) {
      throw new ForbiddenException(
        'No estás matriculado en el grupo correspondiente a esta tarea.',
      );
    }

    // 2. Verificar si ya existe una entrega previa del estudiante para esta tarea
    const entregaExistente = await this.prisma.entrega.findFirst({
      where: {
        id_tarea,
        id_estudiante: idEstudiante,
        deleted: false,
      },
    });

    if (entregaExistente) {
      if (entregaExistente.calificacion !== null) {
        throw new BadRequestException(
          'Esta tarea ya fue calificada por el docente y no puede modificarse.',
        );
      }

      // Si ya existía pero no estaba calificada, la actualizamos automáticamente
      return await this.prisma.entrega.update({
        where: { id: entregaExistente.id },
        data: {
          respuesta: respuesta ?? entregaExistente.respuesta,
          archivo_url: archivo_url ?? entregaExistente.archivo_url,
        },
      });
    }

    // 3. Crear la nueva entrega vinculada al estudiante logueado
    return await this.prisma.entrega.create({
      data: {
        respuesta,
        archivo_url,
        id_tarea,
        id_estudiante: idEstudiante,
      },
    });
  }

  async findAll() {
    return await this.prisma.entrega.findMany({ where: { deleted: false } });
  }

  async findOne(id: number) {
    return await this.prisma.entrega.findFirst({
      where: { id, deleted: false },
    });
  }

  async updateCalificacion(
    id: number,
    updateNotaEstudianteDto: UpdateNotaEstudianteDto,
  ) {
    return await this.prisma.entrega.update({
      where: { id, deleted: false },
      data: updateNotaEstudianteDto,
    });
  }

  async update(id: number, user: any, updateEntregaDto: UpdateEntregaDto) {
    const idEstudiante = Number(user.id ?? user.sub);

    const entrega = await this.prisma.entrega.findFirst({
      where: { id, deleted: false },
    });

    if (!entrega) {
      throw new NotFoundException('La entrega no existe.');
    }

    if (entrega.id_estudiante !== idEstudiante) {
      throw new ForbiddenException(
        'No tienes permiso para editar una entrega que no te pertenece.',
      );
    }

    if (entrega.calificacion !== null) {
      throw new BadRequestException(
        'No puedes modificar esta entrega porque ya ha sido calificada.',
      );
    }

    return await this.prisma.entrega.update({
      where: { id },
      data: {
        respuesta: updateEntregaDto.respuesta,
        archivo_url: updateEntregaDto.archivo_url,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.entrega.update({
      where: { id, deleted: false },
      data: { deleted: true },
    });
  }
}
