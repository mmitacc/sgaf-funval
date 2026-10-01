import { Injectable } from '@nestjs/common';
import { CreateGrupoDto } from './dto/create-grupo.dto.js';
import { UpdateGrupoDto } from './dto/update-grupo.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class GrupoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGrupoDto: CreateGrupoDto) {
    return this.prisma.grupo.create({ data: createGrupoDto });
  }

  async findAll() {
    return this.prisma.grupo.findMany({ where: { deleted: false } });
  }

  async findOne(id: number) {
    return this.prisma.grupo.findFirst({ where: { id, deleted: false } });
  }

  async update(id: number, updateGrupoDto: UpdateGrupoDto) {
    return this.prisma.grupo.update({
      where: { id, deleted: false },
      data: updateGrupoDto,
    });
  }

  async remove(id: number) {
    return this.prisma.grupo.update({
      where: { id, deleted: false },
      data: { deleted: true, deletedate: new Date() },
    });
  }
}
