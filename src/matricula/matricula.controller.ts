import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Req,
} from '@nestjs/common';
import { MatriculaService } from './matricula.service.js';
import { CreateMatriculaDto } from './dto/create-matricula.dto.js';
import { UpdateMatriculaDto } from './dto/update-matricula.dto.js';
import type { Request as RequestExpress } from 'express';
import { Roles } from '../common/decorators/roles.decorator.js';
import { ApiOperation } from '@nestjs/swagger';

@Controller('matricula')
export class MatriculaController {
  constructor(private readonly matriculaService: MatriculaService) {}

  @Roles('ESTUDIANTE')
  @ApiOperation({
    summary: 'Registra una nueva Matricula para un grupo académico',
  })
  @Post()
  create(
    @Request() req: RequestExpress,
    @Body() createMatriculaDto: CreateMatriculaDto,
  ) {
    return this.matriculaService.create(req.user, createMatriculaDto.id_grupo);
  }

  @ApiOperation({
    summary:
      'Lista todas las Matriculas de grupos académicos del Estudiante Logeado',
  })
  @Roles('ESTUDIANTE')
  @Get('estudiante')
  async obtenerMisMatriculas(@Req() req: any) {
    // Ajusta según cómo guardes el ID en tu JwtStrategy (req.user.id o req.user.sub)
    const usuarioId = req.user.id;
    return this.matriculaService.obtenerPorEstudiante(Number(usuarioId));
  }

  @ApiOperation({ summary: 'Lista todas las Matriculas de grupos académicos' })
  @Get()
  findAll() {
    return this.matriculaService.findAll();
  }

  @ApiOperation({
    summary:
      'Muestra una Matricula para un grupo académico, identificada por su ID',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matriculaService.findOne(+id);
  }

  @Roles('ADMINISTRADOR', 'ESTUDIANTE')
  @ApiOperation({
    summary:
      'Actualiza algun dato de una Matricula para un grupo académico identificada por su ID',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMatriculaDto: UpdateMatriculaDto,
  ) {
    return this.matriculaService.update(+id, updateMatriculaDto);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({
    summary:
      'Elimina una Matricula para un grupo académico identificada por su ID',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matriculaService.remove(+id);
  }
}
