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
import { GrupoService } from './grupo.service.js';
import { CreateGrupoDto } from './dto/create-grupo.dto.js';
import { UpdateGrupoDto } from './dto/update-grupo.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { ApiOperation } from '@nestjs/swagger';
import type { Request as RequestExpress } from 'express';

@Controller('grupo')
export class GrupoController {
  constructor(private readonly grupoService: GrupoService) {}

  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Registra un nuevo Grupo académico' })
  @Post()
  create(@Body() createGrupoDto: CreateGrupoDto) {
    return this.grupoService.create(createGrupoDto);
  }

  @ApiOperation({ summary: 'Lista todos la Grupos académicos' })
  @Get()
  findAll() {
    return this.grupoService.findAll();
  }

  @Roles('PROFESOR')
  @ApiOperation({
    summary: 'Lista los grupos asignados al Profesor autenticado',
  })
  @ApiOperation({
    summary: 'Lista los grupos asignados al Profesor autenticado',
  })
  @Get('profesor')
  obtenerMisGrupos(@Request() req: RequestExpress) {
    const usuarioId = Number((req.user as any).id ?? (req.user as any).sub);
    return this.grupoService.obtenerPorProfesor(usuarioId);
  }

  @ApiOperation({
    summary: 'Muestra un Grupo académico, identificado por su ID',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grupoService.findOne(+id);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({
    summary:
      'Actualiza algun dato de un Grupo académico identificado por su ID',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGrupoDto: UpdateGrupoDto) {
    return this.grupoService.update(+id, updateGrupoDto);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({
    summary: 'Elimina un Grupo académico identificado por su ID',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.grupoService.remove(+id);
  }
}
