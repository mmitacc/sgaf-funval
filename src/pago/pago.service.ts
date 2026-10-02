import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePagoDto, PagoMatriculaDto } from './dto/create-pago.dto.js';
import { UpdatePagoDto } from './dto/update-pago.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PeriodoService } from '../periodo/periodo.service.js';
import { DeudaService } from '../deuda/deuda.service.js';
import { Estudiante } from '../prisma/generated/prisma/client.js';
import { EstudianteService } from '../estudiante/estudiante.service.js';

@Injectable()
export class PagoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly periodoService: PeriodoService,
    private readonly deudaService: DeudaService,
    private readonly estudianteService: EstudianteService,
  ) {}

  async create(user: any, createPagoDto: CreatePagoDto) {
    const isEfectivo = createPagoDto.tipo_pago === 'EFECTIVO';
    const deuda = await this.deudaService.findOne(createPagoDto.id_deuda!);
    if (deuda?.id_estudiante !== createPagoDto.id_estudiante)
      throw new BadRequestException(
        `El Estudiante con ID=${createPagoDto.id_estudiante}, NO corresponde a la deuda ID=${deuda?.id}`,
      );
    const periodo = await this.periodoService.findOne(deuda?.id_periodo!);
    const costoMatricula = periodo?.matricula;
    const costoMensualidad = Number(deuda?.deuda_mes);
    const matriculaActual = await this.findPagoMatricula({
      id_periodo: deuda?.id_periodo!,
      id_estudiante: createPagoDto.id_estudiante,
    });
    if (
      matriculaActual.estado_pago !== 'APROBADO' &&
      createPagoDto.concepto !== 'MATRICULA'
    )
      throw new BadRequestException(
        `El Estudiante con ID=${createPagoDto.id_estudiante}, debe primero pagar su MATRICULA de: ${costoMatricula}`,
      );
    if (
      createPagoDto.monto < costoMensualidad &&
      createPagoDto.concepto === 'MENSUALIDAD'
    )
      throw new BadRequestException(
        `El Estudiante con ID=${createPagoDto.id_estudiante}, debe pagar la mensualidad completa de ${costoMensualidad}`,
      );
    return await this.prisma.pago.create({
      data: { id_operador: isEfectivo ? user.id : null, ...createPagoDto },
    });
  }

  async findAll() {
    return await this.prisma.pago.findMany({ where: { deleted: false } });
  }

  async findOne(id: number) {
    return await this.prisma.pago.findFirst({ where: { id, deleted: false } });
  }

  async findPagoMatricula(pagoMatriculaDto: PagoMatriculaDto) {
    const { id_estudiante, id_periodo } = pagoMatriculaDto;
    const estudiante = await this.estudianteService.findOne(id_estudiante);
    if (!estudiante)
      throw new BadRequestException(
        `El usuario con ID=${id_estudiante}, no es un Estudiante.`,
      );
    const periodo = await this.periodoService.findOne(id_periodo);
    if (!periodo)
      throw new BadRequestException(
        `El periodo con ID=${id_periodo}, no existe.`,
      );
    const deuda = await this.prisma.deuda.findFirst({
      where: {
        id_estudiante,
        id_periodo,
        deleted: false,
      },
    });
    if (!deuda) {
      throw new NotFoundException(
        `No se encontró un registro de deuda para el estudiante ID ${id_estudiante} en el periodo ${id_periodo}.`,
      );
    }
    const pagoMatricula = await this.prisma.pago.findFirst({
      where: {
        id_deuda: deuda.id,
        id_estudiante,
        concepto: 'MATRICULA',
        deleted: false,
      },
    });
    if (!pagoMatricula) {
      throw new NotFoundException(
        'El estudiante aún no ha registrado el pago de su matrícula para este periodo.',
      );
    }
    const { monto, ...restoPagoMatricula } = pagoMatricula;
    return { monto: Number(monto), ...restoPagoMatricula };
  }

  async update(id: number, updatePagoDto: UpdatePagoDto) {
    return await this.prisma.pago.update({
      where: { id, deleted: false },
      data: updatePagoDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.pago.update({
      where: { id, deleted: false },
      data: { deleted: true, deletedate: new Date() },
    });
  }
}
