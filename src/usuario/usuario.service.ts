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

  /**
   * Helper interno: Aplana las relaciones profesor y estudiante
   * para devolver un objeto idéntico a UsuarioGenerico en el frontend.
   */
  private aplanarUsuario(usuario: any) {
    if (!usuario) return null;
    const { profesor, estudiante, ...resto } = usuario;

    return {
      ...resto,
      ...(profesor && {
        fecha_contrato: profesor.fecha_contrato,
        id_especialidad: profesor.id_especialidad,
      }),
      ...(estudiante && {
        apoderado: estudiante.apoderado,
      }),
    };
  }

  // ============================================================================
  // 1. CREAR USUARIO (Solo roles administrativos/docentes - Aplanado)
  // ============================================================================
  async create(createUsuarioDto: CreateUsuarioDto) {
    if (createUsuarioDto.rol === 'ESTUDIANTE') {
      throw new BadRequestException(
        'No se puede registrar a un ESTUDIANTE por este medio.',
      );
    }

    const { password, fecha_contrato, id_especialidad, ...restoUsuario } =
      createUsuarioDto;

    const esProfesor = createUsuarioDto.rol === 'PROFESOR';

    if (esProfesor) {
      if (!id_especialidad || !fecha_contrato) {
        throw new BadRequestException(
          'Para el rol PROFESOR, fecha_contrato e id_especialidad son obligatorios.',
        );
      }

      const especialidad = await this.prisma.especialidad.findFirst({
        where: { id: Number(id_especialidad) },
      });

      if (!especialidad) {
        throw new NotFoundException(
          `La especialidad con ID=${id_especialidad} no existe.`,
        );
      }
    }

    const saltRounds = Number(
      this.configService.getOrThrow('BCRYPT_SALT_ROUNDS'),
    );
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const usuarioCreado = await this.prisma.usuario.create({
      data: {
        ...restoUsuario,
        password: hashedPassword,
        ...(esProfesor && {
          profesor: {
            create: {
              fecha_contrato: new Date(fecha_contrato!),
              id_especialidad: Number(id_especialidad),
            },
          },
        }),
      },
      omit: { password: true },
      include: {
        profesor: { omit: { id_usuario: true } },
      },
    });

    return this.aplanarUsuario(usuarioCreado);
  }

  // ============================================================================
  // 2. LISTAR TODOS LOS USUARIOS (Aplanados)
  // ============================================================================
  async findAll() {
    const usuarios = await this.prisma.usuario.findMany({
      where: { deleted: false, rol: { not: 'SUPERADMIN' } },
      orderBy: { id: 'desc' },
      omit: { password: true },
      include: {
        profesor: { omit: { id_usuario: true } },
        estudiante: { omit: { id_usuario: true } },
      },
    });

    return usuarios.map((u) => this.aplanarUsuario(u));
  }

  // ============================================================================
  // 3. OBTENER UN USUARIO POR ID (Aplanado)
  // ============================================================================
  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { id, deleted: false },
      omit: { password: true },
      include: {
        profesor: { omit: { id_usuario: true } },
        estudiante: { omit: { id_usuario: true } },
      },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID=${id} no encontrado.`);
    }

    return this.aplanarUsuario(usuario);
  }

  // ============================================================================
  // 4. ACTUALIZAR USUARIO POR ID (Soporta Profesor, Estudiante y Admin)
  // ============================================================================
  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuarioActual = await this.prisma.usuario.findFirst({
      where: { id, deleted: false },
    });

    if (!usuarioActual) {
      throw new NotFoundException(`Usuario con ID=${id} no encontrado.`);
    }

    const { fecha_contrato, id_especialidad, apoderado, ...restoUsuario } =
      updateUsuarioDto;

    const rolFinal = updateUsuarioDto.rol ?? usuarioActual.rol;

    // Validar especialidad si es PROFESOR y se envía id_especialidad
    if (rolFinal === 'PROFESOR' && id_especialidad) {
      const especialidad = await this.prisma.especialidad.findFirst({
        where: { id: Number(id_especialidad) },
      });
      if (!especialidad) {
        throw new NotFoundException(
          `La especialidad con ID=${id_especialidad} no existe.`,
        );
      }
    }

    const usuarioActualizado = await this.prisma.usuario.update({
      where: { id },
      data: {
        ...restoUsuario,
        // Actualización de relación Profesor si corresponde
        ...(rolFinal === 'PROFESOR' &&
          (fecha_contrato || id_especialidad) && {
            profesor: {
              upsert: {
                create: {
                  fecha_contrato: fecha_contrato
                    ? new Date(fecha_contrato)
                    : new Date(),
                  id_especialidad: Number(id_especialidad),
                },
                update: {
                  ...(fecha_contrato && {
                    fecha_contrato: new Date(fecha_contrato),
                  }),
                  ...(id_especialidad && {
                    id_especialidad: Number(id_especialidad),
                  }),
                },
              },
            },
          }),
        // Actualización de relación Estudiante si corresponde
        ...(rolFinal === 'ESTUDIANTE' &&
          apoderado && {
            estudiante: {
              update: {
                apoderado,
              },
            },
          }),
      },
      omit: { password: true },
      include: {
        profesor: { omit: { id_usuario: true } },
        estudiante: { omit: { id_usuario: true } },
      },
    });

    return this.aplanarUsuario(usuarioActualizado);
  }

  // ============================================================================
  // 5. ELIMINAR USUARIO (Borrado Lógico)
  // ============================================================================
  async remove(id: number) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { id, deleted: false },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID=${id} no encontrado.`);
    }

    await this.prisma.usuario.update({
      where: { id },
      data: { deleted: true, estado: 'INACTIVO' },
    });

    return { message: 'Usuario eliminado correctamente.' };
  }

  // ============================================================================
  // 6. ACTUALIZAR PERFIL PROPIO
  // ============================================================================
  async actualizarPerfil(
    usuarioId: number,
    datos: {
      nombres: string;
      apellidos: string;
      telefono?: string;
      foto_url?: string;
    },
  ) {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!usuarioExistente) throw new NotFoundException('Usuario no encontrado');

    const actualizado = await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        nombres: datos.nombres,
        apellidos: datos.apellidos,
        telefono: datos.telefono,
        ...(datos.foto_url && { foto_url: datos.foto_url }),
      },
      omit: { password: true },
    });

    return this.aplanarUsuario(actualizado);
  }

  // ============================================================================
  // 7. IDENTIFICAR USUARIO POR EMAIL
  // ============================================================================
  async findEmail(email: string) {
    return await this.prisma.usuario.findUnique({ where: { email } });
  }

  // ============================================================================
  // 8. SOLO CAMBIAR PASSWORD
  // ============================================================================

  async cambiarPassword(
    usuarioId: number,
    passwordActual: string,
    passwordNueva: string,
  ) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const passwordValida = await bcrypt.compare(
      passwordActual,
      usuario.password,
    );

    if (!passwordValida) {
      throw new BadRequestException('La contraseña actual es incorrecta.');
    }

    const saltRounds = Number(
      this.configService.getOrThrow('BCRYPT_SALT_ROUNDS'),
    );
    const hashedPassword = await bcrypt.hash(passwordNueva, saltRounds);

    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { password: hashedPassword },
    });

    return { message: 'Contraseña actualizada correctamente.' };
  }

  // ============================================================================
  // 9. RESETEAR CONTRASEÑA (Solo Administrador: INICIALES.usuario123)
  // ============================================================================
  async resetearPassword(id: number) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { id, deleted: false },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID=${id} no encontrado.`);
    }

    // Extraemos la primera letra del primer nombre y la primera letra del primer apellido
    const inicialNombre = usuario.nombres.trim().charAt(0).toUpperCase();
    const inicialApellido = usuario.apellidos.trim().charAt(0).toUpperCase();
    const nuevaPasswordPlana = `${inicialNombre}${inicialApellido}.usuario123`;

    const saltRounds = Number(
      this.configService.getOrThrow('BCRYPT_SALT_ROUNDS'),
    );
    const hashedPassword = await bcrypt.hash(nuevaPasswordPlana, saltRounds);

    await this.prisma.usuario.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return {
      message: 'Contraseña reseteada correctamente.',
      passwordTemporal: nuevaPasswordPlana,
    };
  }
}
