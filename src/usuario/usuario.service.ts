import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  async create(createUsuarioDto: CreateUsuarioDto) {
    if (createUsuarioDto.rol === 'ESTUDIANTE')
      throw new BadRequestException(
        'No se puede registrar a un ESTUDIANTE, por este medio.',
      );
    const { password, datosProfesor, ...restoUsuario } = createUsuarioDto;
    const existeProfesor: boolean = !!(
      createUsuarioDto.rol === 'PROFESOR' &&
      datosProfesor?.id_especialidad &&
      datosProfesor?.fecha_contrato
    );
    if (existeProfesor) {
      const especialildad = this.prisma.especialidad.findFirst({
        where: { id: datosProfesor?.id_especialidad },
      });
      if (!especialildad)
        throw new NotFoundException(
          `La especialidad con ID=${datosProfesor?.id_especialidad} no existe.`,
        );
    }
    const hashedPassword = await bcrypt.hash(
      password,
      this.configService.getOrThrow<number>('BCRYPT_SALT_ROUNDS'),
    );
    return await this.prisma.usuario.create({
      data: {
        ...restoUsuario,
        password: hashedPassword,
        ...(existeProfesor
          ? {
              profesor: {
                create: datosProfesor,
              },
            }
          : {}),
      },
      omit: { password: true },
      include: {
        ...(existeProfesor
          ? {
              profesor: { omit: { id_usuario: true } },
            }
          : {}),
      },
    });
  }

  async findAll() {
    return await this.prisma.usuario.findMany({
      where: { deleted: false },
      omit: { password: true },
    });
  }

  async findOne(id: number) {
    return await this.prisma.usuario.findFirst({
      where: { id, deleted: false },
      omit: { password: true },
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return await this.prisma.usuario.update({
      where: { id, deleted: false },
      data: updateUsuarioDto,
      omit: { password: true },
    });
  }

  async remove(id: number) {
    return await this.prisma.usuario.update({
      where: { id, deleted: false },
      data: { deleted: true, deletedate: new Date() },
      omit: { password: true },
    });
  }

  async findEmail(email: string) {
    return await this.prisma.usuario.findUnique({ where: { email } });
  }
}
