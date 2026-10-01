import { Injectable } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto.js';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';

@Injectable()
export class EstudianteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  async create(createEstudianteDto: CreateEstudianteDto) {
    const ultimoEstudiante = await this.prisma.estudiante.findFirst({
      orderBy: { id_usuario: 'desc' },
    });
    const ultimoCodig = ultimoEstudiante
      ? Number(ultimoEstudiante.codigo.slice(9))
      : 0;
    const { apoderado, password, ...otroUsuario } = createEstudianteDto;
    const hashedPassword = await bcrypt.hash(
      password,
      this.configService.getOrThrow<number>('BCRYPT_SALT_ROUNDSF'),
    );
    return await this.prisma.estudiante.create({
      data: {
        codigo: 'MAT-2026-' + (ultimoCodig + 1),
        apoderado,
        usuario: {
          create: { password: hashedPassword, ...otroUsuario },
        },
      },
      include: { usuario: { omit: { password: true } } },
    });
  }

  async findAll() {
    const usuarios = await this.prisma.estudiante.findMany({
      include: { usuario: { omit: { password: true } } },
    });
    return usuarios.filter((est) => est.usuario.rol === 'ESTUDIANTE');
  }

  async findOne(id_usuario: number) {
    return await this.prisma.estudiante.findFirst({
      where: { id_usuario },
      include: { usuario: { omit: { password: true } } },
    });
  }

  async update(id_usuario: number, updateEstudianteDto: UpdateEstudianteDto) {
    return await this.prisma.estudiante.update({
      where: { id_usuario },
      data: updateEstudianteDto,
      include: { usuario: { omit: { password: true } } },
    });
  }

  async remove(id_usuario: number) {
    return await this.prisma.estudiante.update({
      where: { id_usuario },
      data: { usuario: { update: { deleted: true, deletedate: new Date() } } },
      include: { usuario: { omit: { password: true } } },
    });
  }
}
