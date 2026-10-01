import { Injectable } from '@nestjs/common';
import { CreateEntregaDto } from './dto/create-entrega.dto.js';
import { UpdateEntregaDto } from './dto/update-entrega.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class EntregaService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createEntregaDto: CreateEntregaDto) {
    return await this.prisma.entrega.create({ data: createEntregaDto });
  }

  async findAll() {
    return await this.prisma.entrega.findMany({ where: { deleted: false } });
  }

  async findOne(id: number) {
    return await this.prisma.entrega.findFirst({
      where: { id, deleted: false },
    });
  }

  async update(id: number, updateEntregaDto: UpdateEntregaDto) {
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
