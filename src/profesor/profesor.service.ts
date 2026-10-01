import { Injectable } from '@nestjs/common';
import { UpdateProfesorDto } from './dto/update-profesor.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProfesorService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const usuarios = await this.prisma.profesor.findMany({
      include: { usuario: { omit: { password: true } } },
    });
    return usuarios.filter((est) => est.usuario.rol === 'PROFESOR');
  }

  async findOne(id_usuario: number) {
    return await this.prisma.profesor.findFirst({
      where: { id_usuario },
      include: { usuario: { omit: { password: true } } },
    });
  }

  async update(id_usuario: number, updateProfesorDto: UpdateProfesorDto) {
    return await this.prisma.profesor.update({
      where: { id_usuario },
      data: updateProfesorDto,
      include: { usuario: { omit: { password: true } } },
    });
  }

  async remove(id_usuario: number) {
    return await this.prisma.profesor.update({
      where: { id_usuario },
      data: { usuario: { update: { deleted: true, deletedate: new Date() } } },
      include: { usuario: { omit: { password: true } } },
    });
  }
}
