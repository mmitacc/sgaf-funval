import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { ValidarTablaDto } from './dto/validar-tablas.dto.js';
import { SkipSanitize } from '../common/decorators/skip-sanitize.decorator.js';
import { ValidarTablaIdDto } from './dto/validar-tabla-id.dto.js';
import { ApiOperation } from '@nestjs/swagger';

@SkipSanitize() // Para saltar el interceptor sanitize
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
      'Lista todos los registros eliminados, de cualquier tabla de la BD.',
  })
  @Get(':tabla')
  findAllDeleted(@Param() params: ValidarTablaDto) {
    const { tabla } = params;
    return this.adminService.findAllDeleted(tabla);
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
  @Get(':tabla/:id')
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
