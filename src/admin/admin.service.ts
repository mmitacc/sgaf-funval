import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { TablasPrisma } from './dto/validar-tablas.dto.js';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tabla: TablasPrisma) {
    const modelo = this.prisma[tabla] as any;
    return await modelo.findMany({});
  }

  async findAllDeleted(tabla: TablasPrisma) {
    const modelo = this.prisma[tabla] as any;
    return await modelo.findMany({ where: { deleted: true } });
  }

  async findOne(tabla: TablasPrisma, id: number) {
    const modelo = this.prisma[tabla] as any;
    return await modelo.findOne({
      where: { id },
    });
  }

  async findOneActiveDelete(tabla: TablasPrisma, id: number) {
    const modelo = this.prisma[tabla] as any;
    return await modelo.update({
      where: { id, deleted: true },
      data: { deleted: false },
    });
  }

  async remove(tabla: TablasPrisma, id: number) {
    const modelo = this.prisma[tabla] as any;
    return await modelo.delete({
      where: { id, delete: true },
    });
  }
}
