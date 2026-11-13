import { Injectable, Logger } from '@nestjs/common';
import { CreateDeudaDto } from './dto/create-deuda.dto.js';
import { UpdateDeudaDto } from './dto/update-deuda.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdatePagoDto } from '../pago/dto/update-pago.dto.js';
import { Estado, Rol } from '../prisma/generated/prisma/enums.js';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class DeudaService {
  private readonly logger = new Logger(DeudaService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createDeudaDto: CreateDeudaDto) {
    return await this.prisma.deuda.create({ data: createDeudaDto });
  }

  async findAll() {
    return await this.prisma.deuda.findMany({ where: { deleted: false } });
  }

  async findOne(id: number) {
    return await this.prisma.deuda.findFirst({ where: { id, deleted: false } });
  }

  async findEstudiante(user: any) {
    const id = Number(user.id);
    return await this.prisma.deuda.findFirst({
      where: { id_estudiante: id, deleted: false },
    });
  }

  async findIdEstudiante(id: number) {
    return await this.prisma.deuda.findFirst({
      where: { id_estudiante: id, deleted: false },
    });
  }

  async update(id: number, updateDeudaDto: UpdateDeudaDto) {
    return await this.prisma.deuda.update({
      where: { id, deleted: false },
      data: updateDeudaDto,
    });
  }

  async updateDeudaPendiente(id: number, data: UpdatePagoDto) {
    const { monto } = data;
    const deudaActual = await this.prisma.deuda.update({
      where: { id, deleted: false },
      data: { pendiente: { decrement: monto } },
    });
    if (Number(deudaActual.pendiente) === 0) this.update(id, { deuda_mes: 0 });
    return await this.findOne(id);
  }

  async remove(id: number) {
    return await this.prisma.deuda.update({
      where: { id, deleted: false },
      data: { deleted: true, deletedate: new Date() },
    });
  }

  @Cron('0 0 1 * *')
  async ejecutarCorteMensualMorosos(): Promise<number> {
    this.logger.log(
      'Iniciando proceso automático de suspensión por morosidad...',
    );
    try {
      const resultado = await this.prisma.usuario.updateMany({
        where: {
          deleted: false,
          rol: Rol.ESTUDIANTE,
          estado: Estado.ACTIVO,
          estudiante: {
            deudas: {
              some: {
                deleted: false,
                moroso: true,
              },
            },
          },
        },
        data: {
          estado: Estado.SUSPENDIDO,
        },
      });

      this.logger.log(
        `Corte mensual completado con éxito. Estudiantes suspendidos: ${resultado.count}`,
      );
      return resultado.count;
    } catch (error: any) {
      this.logger.error(
        'Error crítico al suspender estudiantes morosos:',
        error.stack,
      );
      throw error;
    }
  }

  async forzarCorteManual() {
    return await this.ejecutarCorteMensualMorosos();
  }
}
