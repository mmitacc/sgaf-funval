import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUsuarioDto: CreateUsuarioDto) {
    const { password, ...restoUsuario } = createUsuarioDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.prisma.usuario.create({
      data: { password: hashedPassword, ...restoUsuario },
      omit: { password: true },
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
}
