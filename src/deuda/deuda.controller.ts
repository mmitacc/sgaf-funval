import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { DeudaService } from './deuda.service.js';
import { CreateDeudaDto } from './dto/create-deuda.dto.js';
import { UpdateDeudaDto } from './dto/update-deuda.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import type { Request as RequestExpress } from 'express';
import { ApiOperation } from '@nestjs/swagger';

@Controller('deuda')
export class DeudaController {
  constructor(private readonly deudaService: DeudaService) {}

  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Registra una nueva Deuda' })
  @Post()
  create(@Body() createDeudaDto: CreateDeudaDto) {
    return this.deudaService.create(createDeudaDto);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Lista todas las Deudas' })
  @Get()
  findAll() {
    return this.deudaService.findAll();
  }

  //Endpoint para ejecutar el corte de morosos bajo demanda.
  @Roles('ADMINISTRADOR')
  @ApiOperation({
    summary:
      'Ejecuta un corte en la fecha, para actualizar el estado=SUSPENDIDO para los Estudiantes Morosos.',
  })
  @Post('corte-mensual')
  @HttpCode(HttpStatus.OK)
  async forzarCorte() {
    const totalAfectados = await this.deudaService.forzarCorteManual();
    return {
      success: true,
      message: 'Proceso de suspensión por morosidad ejecutado manualmente.',
      estudiantesSuspendidos: totalAfectados,
    };
  }

  @Roles('ESTUDIANTE')
  @ApiOperation({ summary: 'Muesta la Deuda del Estudiante autenticado.' })
  @Get('estudiante')
  findEstudiante(@Request() req: RequestExpress) {
    return this.deudaService.findEstudiante(req.user);
  }

  @Roles('RECEPCIONISTA')
  @ApiOperation({ summary: 'Muestra una Deuda, identificada por su ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deudaService.findOne(+id);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({
    summary: 'Actualiza algun dato de una Deuda identificada por su ID',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeudaDto: UpdateDeudaDto) {
    return this.deudaService.update(+id, updateDeudaDto);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Elimina una Deuda identificada por su ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deudaService.remove(+id);
  }
}
