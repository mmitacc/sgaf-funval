import { Injectable } from '@nestjs/common';
import { CreateHorarioDto } from './dto/create-horario.dto.js';
import { UpdateHorarioDto } from './dto/update-horario.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class HorarioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createHorarioDto: CreateHorarioDto) {
    return await this.prisma.horario.create({ data: createHorarioDto });
  }

  async findAll() {
    return await this.prisma.horario.findMany({ where: { deleted: false } });
  }

  async findOne(id: number) {
    return await this.prisma.horario.findFirst({
      where: { id, deleted: false },
    });
  }

  async update(id: number, updateHorarioDto: UpdateHorarioDto) {
    return await this.prisma.horario.update({
      where: { id, deleted: false },
      data: updateHorarioDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.horario.update({
      where: { id, deleted: false },
      data: { deleted: true, deletedate: new Date() },
    });
  }
}
