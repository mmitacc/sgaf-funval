import { Injectable } from '@nestjs/common';
import { CreateAulaDto } from './dto/create-aula.dto.js';
import { UpdateAulaDto } from './dto/update-aula.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AulaService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAulaDto: CreateAulaDto) {
    return await this.prisma.aula.create({ data: createAulaDto });
  }

  async findAll() {
    return await this.prisma.aula.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.aula.findFirst({ where: { id } });
  }

  async update(id: number, updateAulaDto: UpdateAulaDto) {
    return await this.prisma.aula.update({
      where: { id },
      data: updateAulaDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.aula.update({
      where: { id },
      data: { deleted: true, deletedate: new Date() },
    });
  }
}
