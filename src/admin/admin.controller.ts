import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { ValidarTablaDto } from './dto/validar-tablas.dto.js';
import { SkipSanitize } from '../common/decorators/skip-sanitize.decorator.js';
import { ValidarTablaIdDto } from './dto/validar-tabla-id.dto.js';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator.js';

@SkipSanitize() // Para saltar el interceptor sanitize
@Roles('ADMINISTRADOR')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({
    summary:
      'Trae el resumen por rol operativo, academico y finanzas del Período Académico actual.',
  })
  @Get('dashboard')
  obtenerDashboardEjecutivo() {
    return this.adminService.obtenerDashboardEjecutivo();
  }

  @ApiOperation({
    summary:
      'Trae el resumen de todos los reportes detallados en Finanzas del Período Académico por periodoId.',
  })
  @ApiQuery({
    name: 'idPeriodo',
    required: false,
    type: Number,
    description:
      'ID del periodo académico (opcional; si se omite usa el más reciente)',
  })
  @Get('finanzas/resumen')
  obtenerResumenFinanciero(
    @Query('idPeriodo', new ParseIntPipe({ optional: true }))
    idPeriodo?: number,
  ) {
    return this.adminService.obtenerResumenFinanciero(idPeriodo);
  }

  @ApiOperation({
    summary:
      'Lista todos los registros eliminados, de cualquier tabla de la BD.',
  })
  @Get('deleted/:tabla')
  findAllDeleted(@Param() params: ValidarTablaDto) {
    const { tabla } = params;
    return this.adminService.findAllDeleted(tabla);
  }

  @ApiOperation({
    summary: 'Lista todos los registros, de cualquier tabla de la BD.',
  })
  @Get(':tabla')
  findAll(@Param() params: ValidarTablaDto) {
    const { tabla } = params;
    return this.adminService.findAll(tabla);
  }

  @ApiOperation({
    summary:
      'Muestra un registro identificado por ID, de cualquier tabla de la BD.',
  })
  @Get(':tabla/:id')
  findOne(@Param() params: ValidarTablaIdDto) {
    const { tabla, id } = params;
    return this.adminService.findOne(tabla, +id);
  }

  @ApiOperation({
    summary:
      'Recupera/restaura un registro eliminado identificandolo por su ID, de cualquier tabla de la BD.',
  })
  @Patch(':tabla/:id')
  findOneActiveDelete(@Param() params: ValidarTablaIdDto) {
    const { tabla, id } = params;
    return this.adminService.findOneActiveDelete(tabla, +id);
  }

  @ApiOperation({
    summary:
      'Destruye/elimina realmente un registro identificandolo por su ID, de cualquier tabla de la BD.',
  })
  @Delete(':tabla/:id')
  remove(@Param() params: ValidarTablaIdDto) {
    const { tabla, id } = params;
    return this.adminService.remove(tabla, +id);
  }
}
