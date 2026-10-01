import { Injectable } from '@nestjs/common';
import { CreateDeudaDto } from './dto/create-deuda.dto.js';
import { UpdateDeudaDto } from './dto/update-deuda.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DeudaService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createDeudaDto: CreateDeudaDto) {
    return await this.prisma.deuda.create({ data: createDeudaDto });
  }

  async findAll() {
    return await this.prisma.deuda.findMany({ where: { deleted: false } });
  }

  async findOne(id: number) {
    return await this.prisma.deuda.findFirst({ where: { id, deleted: false } });
  }

  async update(id: number, updateDeudaDto: UpdateDeudaDto) {
    return await this.prisma.deuda.update({
      where: { id, deleted: false },
      data: updateDeudaDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.deuda.update({
      where: { id, deleted: false },
      data: { deleted: true, deletedate: new Date() },
    });
  }
}
