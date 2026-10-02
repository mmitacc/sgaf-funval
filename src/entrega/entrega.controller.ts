import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import type { Request as RequestExpress } from 'express';
import { EntregaService } from './entrega.service.js';
import { CreateEntregaEstudianteDto } from './dto/create-entrega.dto.js';
import {
  UpdateEntregaDto,
  UpdateNotaEstudianteDto,
} from './dto/update-entrega.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { ApiOperation } from '@nestjs/swagger';

@Controller('entrega')
export class EntregaController {
  constructor(private readonly entregaService: EntregaService) {}

  @Roles('ESTUDIANTE')
  @ApiOperation({ summary: 'Registra una nueva Entrega de tarea' })
  @Post()
  create(@Body() createEntregaEstudianteDto: CreateEntregaEstudianteDto) {
    return this.entregaService.create(createEntregaEstudianteDto);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Lista todas las Entregas de tarea' })
  @Get()
  findAll() {
    return this.entregaService.findAll();
  }

  @Roles('ESTUDIANTE')
  @ApiOperation({
    summary: 'Muestra una Entrega de tarea, identificada por su ID',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entregaService.findOne(+id);
  }

  @Roles('ESTUDIANTE')
  @ApiOperation({
    summary:
      'Actualiza algun dato de una Entrega de tarea del Estudiante autenticado.',
  })
  @Patch('estudiante')
  update(
    @Request() req: RequestExpress,
    @Body() updateEntregaDto: UpdateEntregaDto,
  ) {
    return this.entregaService.update(req.user, updateEntregaDto);
  }

  @Roles('PROFESOR')
  @ApiOperation({
    summary:
      'Actualiza la Calificacion, de una Entrega de tarea identificada por su ID',
  })
  @Patch('calificacion/:id')
  updateCalificacion(
    @Param('id') id: string,
    @Body() updateNotaEstudianteDto: UpdateNotaEstudianteDto,
  ) {
    return this.entregaService.updateCalificacion(+id, updateNotaEstudianteDto);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({
    summary: 'Elimina una Entrega de tarea identificada por su ID',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entregaService.remove(+id);
  }
}
