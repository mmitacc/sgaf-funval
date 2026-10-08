import { Injectable, Logger } from '@nestjs/common';
import { CreateDeudaDto } from './dto/create-deuda.dto.js';
import { UpdateDeudaDto } from './dto/update-deuda.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdatePagoDto } from '../pago/dto/update-pago.dto.js';
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
    return await this.prisma.deuda.findFirst({ where: { id, deleted: false } });
  }

  async update(id: number, updateDeudaDto: UpdateDeudaDto) {
    return await this.prisma.deuda.update({
      where: { id, deleted: false },
      data: updateDeudaDto,
    });
  }

  async updateDeudaPendiente(id: number, data: UpdatePagoDto) {
    const { monto } = data;
    return await this.prisma.deuda.update({
      where: { id, deleted: false },
      data: { pendiente: { decrement: monto } },
    });
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
      const totalAfectados = await this.prisma.$queryRaw<any[]>`
        UPDATE "USUARIO"
        SET estado = 'SUSPENDIDO'
        WHERE id IN (
          SELECT id_estudiante 
          FROM "DEUDA" 
          WHERE moroso = TRUE
        ) AND estado != 'SUSPENDIDO'
        RETURNING id, estado;
        `;

      this.logger.log(
        `Corte mensual completado con éxito. Estudiantes suspendidos: ${totalAfectados.length}`,
      );
      return totalAfectados.length;
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
