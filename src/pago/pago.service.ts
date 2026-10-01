import { Injectable } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto.js';
import { UpdatePagoDto } from './dto/update-pago.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PagoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: any, createPagoDto: CreatePagoDto) {
    const isEfectivo = createPagoDto.tipo_pago === 'EFECTIVO';
    return await this.prisma.pago.create({
      data: { id_operador: isEfectivo ? user.id : null, ...createPagoDto },
    });
  }

  async findAll() {
    return await this.prisma.pago.findMany({ where: { deleted: false } });
  }

  async findOne(id: number) {
    return await this.prisma.pago.findFirst({ where: { id, deleted: false } });
  }

  async update(id: number, updatePagoDto: UpdatePagoDto) {
    return await this.prisma.pago.update({
      where: { id, deleted: false },
      data: updatePagoDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.pago.update({
      where: { id, deleted: false },
      data: { deleted: true, deletedate: new Date() },
    });
  }
}
