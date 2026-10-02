import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PeriodoService } from './periodo.service.js';
import { CreatePeriodoDto } from './dto/create-periodo.dto.js';
import { UpdatePeriodoDto } from './dto/update-periodo.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { ApiOperation } from '@nestjs/swagger';

@Controller('periodo')
export class PeriodoController {
  constructor(private readonly periodoService: PeriodoService) {}

  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Registra un nuevo Período académico' })
  @Post()
  create(@Body() createPeriodoDto: CreatePeriodoDto) {
    return this.periodoService.create(createPeriodoDto);
  }

  @ApiOperation({ summary: 'Lista todos los Períodos académicos' })
  @Get()
  findAll() {
    return this.periodoService.findAll();
  }

  @ApiOperation({
    summary: 'Muestra un Período académico, identificado por su ID',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.periodoService.findOne(+id);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({
    summary:
      'Actualiza algun dato de un Período académico identificado por su ID',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePeriodoDto: UpdatePeriodoDto) {
    return this.periodoService.update(+id, updatePeriodoDto);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({
    summary: 'Elimina un Período académico identificado por su ID',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.periodoService.remove(+id);
  }
}
