import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto.js';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ConfigService } from '@nestjs/config';
import { UsuarioService } from '../usuario/usuario.service.js';
import bcrypt from 'bcryptjs';

@Injectable()
export class EstudianteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly usuarioService: UsuarioService,
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
      where: { usuario: { deleted: false } },
      include: { usuario: { omit: { password: true } } },
    });
    return usuarios.filter((est) => est.usuario.rol === 'ESTUDIANTE');
  }

  async findOne(id_usuario: number) {
    const estudiante = await this.prisma.estudiante.findFirst({
      where: { id_usuario },
      include: { usuario: { omit: { password: true } } },
    });
    if (!estudiante || estudiante?.usuario.rol !== 'ESTUDIANTE')
      throw new BadRequestException(
        `El ID=${id_usuario}, no pertenece a un Estudiante.`,
      );
    return estudiante;
  }

  async updateEstado(id: number) {
    const estudiante = await this.usuarioService.findOne(id);
    if (!estudiante || estudiante?.rol !== 'ESTUDIANTE')
      throw new BadRequestException(
        `El ID=${id}, no pertenece a un Estudiante.`,
      );
    if (estudiante.estado === 'ACTIVO')
      throw new BadRequestException(
        `El Estudiante con ID=${id}, ya esta ACTIVO en el Sistema.`,
      );
    return await this.usuarioService.update(id, { estado: 'ACTIVO' });
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
