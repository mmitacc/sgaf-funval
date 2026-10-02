import { Injectable } from '@nestjs/common';
import { CreateEntregaEstudianteDto } from './dto/create-entrega.dto.js';
import {
  UpdateEntregaDto,
  UpdateNotaEstudianteDto,
} from './dto/update-entrega.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class EntregaService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createEntregaEstudianteDto: CreateEntregaEstudianteDto) {
    return await this.prisma.entrega.create({
      data: createEntregaEstudianteDto,
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

  async update(user: any, updateEntregaDto: UpdateEntregaDto) {
    const id = Number(user.id);
    return await this.prisma.entrega.update({
      where: { id, deleted: false },
      data: updateEntregaDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.entrega.update({
      where: { id, deleted: false },
      data: { deleted: true },
    });
  }
}
