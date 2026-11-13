import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { TablasPrisma } from './dto/validar-tablas.dto.js';
import { EstadoPago, Rol } from '../prisma/generated/prisma/enums.js';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tabla: TablasPrisma) {
    const modelo = this.prisma[tabla] as any;
    return await modelo.findMany({});
  }

  async findAllDeleted(tabla: TablasPrisma) {
    const modelo = this.prisma[tabla] as any;
    return await modelo.findMany({ where: { deleted: true } });
  }

  async findOne(tabla: TablasPrisma, id: number) {
    const modelo = this.prisma[tabla] as any;
    return await modelo.findOne({
      where: { id },
    });
  }

  async findOneActiveDelete(tabla: TablasPrisma, id: number) {
    const modelo = this.prisma[tabla] as any;
    return await modelo.update({
      where: { id, deleted: true },
      data: { deleted: false },
    });
  }

  async remove(tabla: TablasPrisma, id: number) {
    const modelo = this.prisma[tabla] as any;
    return await modelo.delete({
      where: { id },
    });
  }

  // Metodos para Finanzas y Reportes
  // 1. ENDPOINT: GET /api/admin/finanzas/resumen
  async obtenerResumenFinanciero(idPeriodo?: number) {
    const periodos = await this.prisma.periodo.findMany({
      where: { deleted: false },
      orderBy: { inicio: 'desc' },
      select: { id: true, nombre: true, inicio: true, fin: true },
    });

    // Toma el periodo enviado por query param, o por defecto el más reciente (índice 0)
    const periodoSeleccionado =
      periodos.find((p) => p.id === idPeriodo) ?? periodos[0];

    // Si aún no hay ningún periodo creado en la BD, devolvemos estructura vacía segura
    if (!periodoSeleccionado) {
      return {
        periodos: [],
        periodoSeleccionado: null,
        kpis: {
          totalProyectado: 0,
          totalRecaudado: 0,
          saldoPendiente: 0,
          totalMorosos: 0,
          totalCuentas: 0,
        },
        charts: { porConcepto: [], porCanal: [], evolucionMensual: [] },
        ultimosPagos: [],
      };
    }

    const periodoActivoId = periodoSeleccionado.id;

    const [deudasAgg, totalMorosos] = await Promise.all([
      this.prisma.deuda.aggregate({
        where: { deleted: false, id_periodo: periodoActivoId },
        _sum: { total_deuda: true, pendiente: true },
        _count: { id: true },
      }),
      this.prisma.deuda.count({
        where: { deleted: false, id_periodo: periodoActivoId, moroso: true },
      }),
    ]);

    const pagos = await this.prisma.pago.findMany({
      where: {
        deleted: false,
        estado_pago: EstadoPago.APROBADO,
        OR: [
          { deuda: { id_periodo: periodoActivoId } },
          {
            id_deuda: null,
            created: {
              gte: periodoSeleccionado.inicio,
              lte: periodoSeleccionado.fin,
            },
          },
        ],
      },
      include: {
        estudiante: {
          include: {
            usuario: { select: { nombres: true, apellidos: true } },
          },
        },
        operador: { select: { nombres: true, apellidos: true } },
      },
      orderBy: { created: 'desc' },
    });

    const totalRecaudado = pagos.reduce((acc, p) => acc + Number(p.monto), 0);

    const porConceptoMap = new Map<string, number>();
    const porCanalMap = { 'En Línea': 0, 'Caja / Ventanilla': 0 };
    const porMesMap = new Map<string, number>();

    pagos.forEach((p) => {
      const monto = Number(p.monto);
      porConceptoMap.set(
        p.concepto,
        (porConceptoMap.get(p.concepto) || 0) + monto,
      );

      if (p.id_operador) porCanalMap['Caja / Ventanilla'] += monto;
      else porCanalMap['En Línea'] += monto;

      const mes = p.created
        .toLocaleString('es-PE', { month: 'short' })
        .toUpperCase();
      porMesMap.set(mes, (porMesMap.get(mes) || 0) + monto);
    });

    return {
      periodos: periodos.map(({ id, nombre }) => ({ id, nombre })),
      periodoSeleccionado: periodoActivoId,
      kpis: {
        totalProyectado: Number(deudasAgg._sum.total_deuda || 0),
        totalRecaudado,
        saldoPendiente: Number(deudasAgg._sum.pendiente || 0),
        totalMorosos,
        totalCuentas: deudasAgg._count.id,
      },
      charts: {
        porConcepto: Array.from(porConceptoMap, ([name, value]) => ({
          name,
          value,
        })),
        porCanal: Object.entries(porCanalMap).map(([canal, monto]) => ({
          canal,
          monto,
        })),
        evolucionMensual: Array.from(porMesMap, ([mes, recaudado]) => ({
          mes,
          recaudado,
        })).reverse(),
      },
      ultimosPagos: pagos.slice(0, 20).map((p) => ({
        id: p.id,
        fecha: p.created,
        estudiante: `${p.estudiante.usuario.nombres} ${p.estudiante.usuario.apellidos}`,
        concepto: p.concepto,
        descripcion: p.descripcion,
        tipoPago: p.tipo_pago,
        canal: p.operador ? `Caja (${p.operador.nombres})` : 'Pago en Línea',
        monto: Number(p.monto),
      })),
    };
  }

  // 2. ENDPOINT: GET /api/admin/dashboard
  async obtenerDashboardEjecutivo() {
    const periodoActual = await this.prisma.periodo.findFirst({
      where: { deleted: false },
      orderBy: { inicio: 'desc' },
    });

    const [usuariosPorRol, gruposActivos, matriculasPeriodo, deudasAgg] =
      await Promise.all([
        this.prisma.usuario.groupBy({
          by: ['rol'],
          where: { deleted: false },
          _count: { id: true },
        }),
        this.prisma.grupo.findMany({
          where: { deleted: false, id_periodo: periodoActual?.id },
          include: {
            materia: { select: { nombre: true } },
            aula: { select: { nombre: true } },
            profesor: {
              include: {
                usuario: { select: { nombres: true, apellidos: true } },
              },
            },
            _count: { select: { matriculas: { where: { deleted: false } } } },
          },
        }),
        this.prisma.matricula.count({
          where: { deleted: false, grupo: { id_periodo: periodoActual?.id } },
        }),
        this.prisma.deuda.aggregate({
          where: { deleted: false, id_periodo: periodoActual?.id },
          _sum: { total_deuda: true, pendiente: true },
        }),
      ]);

    const contarRol = (rolBuscado: Rol) =>
      usuariosPorRol.find((u) => u.rol === rolBuscado)?._count.id ?? 0;

    const ocupacionGrupos = gruposActivos
      .map((g) => ({
        nombre: `${g.materia.nombre} (${g.aula.nombre})`,
        profesor: `${g.profesor.usuario.nombres} ${g.profesor.usuario.apellidos}`,
        inscritos: g._count.matriculas,
        capacidad: g.capacidad,
        porcentaje:
          g.capacidad > 0
            ? Math.round((g._count.matriculas / g.capacidad) * 100)
            : 0,
      }))
      .sort((a, b) => b.porcentaje - a.porcentaje)
      .slice(0, 5);

    const proyectado = Number(deudasAgg._sum.total_deuda || 0);
    const pendiente = Number(deudasAgg._sum.pendiente || 0);

    return {
      periodo: periodoActual?.nombre ?? 'Sin periodo activo',
      comunidad: {
        estudiantes: contarRol(Rol.ESTUDIANTE),
        profesores: contarRol(Rol.PROFESOR),
        recepcionistas: contarRol(Rol.RECEPCIONISTA),
      },
      academico: {
        totalGrupos: gruposActivos.length,
        totalMatriculas: matriculasPeriodo,
        ocupacionGrupos,
      },
      finanzasResumen: {
        recaudado: proyectado - pendiente,
        pendiente,
      },
    };
  }
}
