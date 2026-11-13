import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMaterialGrupoDto } from './dto/create-material-grupo.dto.js';
import { UpdateMaterialGrupoDto } from './dto/update-material-grupo.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { GrupoService } from '../grupo/grupo.service.js';

@Injectable()
export class MaterialGrupoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly grupoService: GrupoService,
  ) {}

  async crear(dto: CreateMaterialGrupoDto, idUsuarioProfesor: number) {
    const grupo = await this.grupoService.findOne(dto.id_grupo);

    if (!grupo) {
      throw new NotFoundException('El grupo especificado no existe.');
    }

    if (grupo.id_profesor !== idUsuarioProfesor) {
      throw new ForbiddenException(
        'No tienes permisos para publicar en este grupo.',
      );
    }

    return this.prisma.materialGrupo.create({
      data: {
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        tipo: dto.tipo ?? 'ENLACE',
        url: dto.url,
        id_grupo: dto.id_grupo,
      },
    });
  }

  async listarPorGrupo(idGrupo: number) {
    return this.prisma.materialGrupo.findMany({
      where: { id_grupo: idGrupo },
      orderBy: { created: 'desc' },
    });
  }

  async eliminar(id: number, idUsuarioProfesor: number) {
    const material = await this.prisma.materialGrupo.findUnique({
      where: { id },
      include: { grupo: true },
    });

    if (!material) {
      throw new NotFoundException('Material no encontrado.');
    }

    if (material.grupo.id_profesor !== idUsuarioProfesor) {
      throw new ForbiddenException('No puedes eliminar este material.');
    }

    await this.prisma.materialGrupo.delete({ where: { id } });
    return { message: 'Material eliminado correctamente.' };
  }
}
