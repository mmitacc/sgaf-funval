import { Injectable } from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto.js';
import { UpdateMateriaDto } from './dto/update-materia.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class MateriaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMateriaDto: CreateMateriaDto) {
    return await this.prisma.materia.create({ data: createMateriaDto });
  }

  async findAll() {
    return await this.prisma.materia.findMany({ where: { deleted: false } });
  }

  async findOne(id: number) {
    return await this.prisma.materia.findFirst({
      where: { id, deleted: false },
    });
  }

  async update(id: number, updateMateriaDto: UpdateMateriaDto) {
    return await this.prisma.materia.update({
      where: { id, deleted: false },
      data: updateMateriaDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.materia.update({
      where: { id, deleted: false },
      data: { deleted: true, deletedate: new Date() },
    });
  }
}
