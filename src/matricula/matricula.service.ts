import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateMatriculaDto } from './dto/update-matricula.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { VALIDATE_MATRICULA_ESTUDIANTE } from './queries/validar-matricula.query.js';

@Injectable()
export class MatriculaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: any, id_grupo: number) {
    const estudiante = await this.prisma.usuario.findFirst({
      where: { id: user.id },
    });
    if (estudiante?.rol !== 'ESTUDIANTE')
      throw new BadRequestException(`El ID=${user.id} no es un ESTUDIANTE.`);
    const result = await this.prisma.$queryRaw<any[]>(
      VALIDATE_MATRICULA_ESTUDIANTE(user.id, id_grupo),
    );
    const status = result[0];
    if (status.id_matricula_creada) {
      return {
        success: true,
        message: 'Inscripción realizada con éxito.',
        idMatricula: status.id_matricula_creada,
      };
    } else {
      let motivos: string[] = [];
      if (status.error_capacidad)
        motivos.push('El grupo alcanzó su capacidad máxima.');
      if (status.error_creditos)
        motivos.push(
          'La suma de créditos supera el límite permitido para el periodo.',
        );
      if (status.error_materia)
        motivos.push(
          'El estudiante ya está inscrito en esta materia dentro del mismo periodo.',
        );
      if (status.error_horario)
        motivos.push(
          'Existe un traslape de horario con otro grupo ya inscrito.',
        );

      return {
        success: false,
        message: 'Inscripción rechazada por reglas de negocio.',
        errores: motivos,
      };
    }
  }

  async findAll() {
    return await this.prisma.matricula.findMany({ where: { deleted: false } });
  }

  async findOne(id: number) {
    return await this.prisma.matricula.findFirst({
      where: { id, deleted: false },
    });
  }

  async update(id: number, updateMatriculaDto: UpdateMatriculaDto) {
    return await this.prisma.matricula.update({
      where: { id, deleted: false },
      data: updateMatriculaDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.matricula.update({
      where: { id, deleted: false },
      data: { deleted: true, deletedate: new Date() },
    });
  }
}
