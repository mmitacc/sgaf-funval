import { Injectable } from '@nestjs/common';
import { UpdateProfesorDto } from './dto/update-profesor.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProfesorService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const profesores = await this.prisma.profesor.findMany({
      where: {
        usuario: {
          rol: 'PROFESOR',
        },
      },
      include: {
        usuario: {
          omit: { password: true },
        },
      },
    });

    // Aplanamos cada registro de la lista
    return profesores.map(({ usuario, ...profesorData }) => ({
      ...profesorData,
      ...usuario,
    }));
  }

  async findOne(id_usuario: number) {
    const profesor = await this.prisma.profesor.findFirst({
      where: { id_usuario },
      include: {
        usuario: {
          omit: { password: true },
        },
      },
    });

    if (!profesor) return null;

    const { usuario, ...profesorData } = profesor;

    return {
      ...profesorData,
      ...usuario,
    };
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
