import { Injectable } from '@nestjs/common';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto.js';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class EspecialidadService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createEspecialidadDto: CreateEspecialidadDto) {
    return this.prisma.especialidad.create({ data: createEspecialidadDto });
  }

  async findAll() {
    return this.prisma.especialidad.findMany({ where: { deleted: false } });
  }

  async findOne(id: number) {
    return this.prisma.especialidad.findFirst({
      where: { id, deleted: false },
    });
  }

  async update(id: number, updateEspecialidadDto: UpdateEspecialidadDto) {
    return this.prisma.especialidad.update({
      where: { id, deleted: false },
      data: updateEspecialidadDto,
    });
  }

  async remove(id: number) {
    return this.prisma.especialidad.update({
      where: { id, deleted: false },
      data: { deleted: true },
    });
  }
}
