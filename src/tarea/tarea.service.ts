import { Injectable } from '@nestjs/common';
import { CreateTareaDto } from './dto/create-tarea.dto.js';
import { UpdateTareaDto } from './dto/update-tarea.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TareaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTareaDto: CreateTareaDto) {
    return await this.prisma.tarea.create({ data: createTareaDto });
  }

  async findAll() {
    return await this.prisma.tarea.findMany({ where: { deleted: false } });
  }

  async findOne(id: number) {
    return await this.prisma.tarea.findFirst({ where: { id, deleted: false } });
  }

  async update(id: number, updateTareaDto: UpdateTareaDto) {
    return await this.prisma.tarea.update({
      where: { id, deleted: false },
      data: updateTareaDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.tarea.update({
      where: { id, deleted: false },
      data: { deleted: true, deletedate: new Date() },
    });
  }
}
