import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePeriodoDto } from './dto/create-periodo.dto.js';
import { UpdatePeriodoDto } from './dto/update-periodo.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PeriodoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPeriodoDto: CreatePeriodoDto) {
    if (createPeriodoDto.fin.getTime() <= createPeriodoDto.inicio.getTime()) {
      throw new BadRequestException(
        'La fecha de fin debe ser estrictamente posterior a la fecha de inicio.',
      );
    }
    return await this.prisma.periodo.create({ data: createPeriodoDto });
  }

  async findAll() {
    return await this.prisma.periodo.findMany({ where: { deleted: false } });
  }

  async findOne(id: number) {
    return await this.prisma.periodo.findFirst({
      where: { id, deleted: false },
    });
  }

  async update(id: number, updatePeriodoDto: UpdatePeriodoDto) {
    return await this.prisma.periodo.update({
      where: { id, deleted: false },
      data: updatePeriodoDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.periodo.update({
      where: { id, deleted: false },
      data: { deleted: true, deletedate: new Date() },
    });
  }
}
