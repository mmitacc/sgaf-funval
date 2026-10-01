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
import { MatriculaService } from './matricula.service.js';
import { CreateMatriculaDto } from './dto/create-matricula.dto.js';
import { UpdateMatriculaDto } from './dto/update-matricula.dto.js';
import type { Request as RequestExpress } from 'express';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('matricula')
export class MatriculaController {
  constructor(private readonly matriculaService: MatriculaService) {}

  @Roles('ESTUDIANTE')
  @Post()
  create(
    @Request() req: RequestExpress,
    @Body() createMatriculaDto: CreateMatriculaDto,
  ) {
    return this.matriculaService.create(req.user, createMatriculaDto.id_grupo);
  }

  @Get()
  findAll() {
    return this.matriculaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matriculaService.findOne(+id);
  }

  @Roles('ADMINISTRADOR', 'ESTUDIANTE')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMatriculaDto: UpdateMatriculaDto,
  ) {
    return this.matriculaService.update(+id, updateMatriculaDto);
  }

  @Roles('ADMINISTRADOR')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matriculaService.remove(+id);
  }
}
