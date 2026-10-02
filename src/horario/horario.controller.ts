import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HorarioService } from './horario.service.js';
import { CreateHorarioDto } from './dto/create-horario.dto.js';
import { UpdateHorarioDto } from './dto/update-horario.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { ApiOperation } from '@nestjs/swagger';

@Controller('horario')
export class HorarioController {
  constructor(private readonly horarioService: HorarioService) {}

  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Registra un nuevo Horario académico' })
  @Post()
  create(@Body() createHorarioDto: CreateHorarioDto) {
    return this.horarioService.create(createHorarioDto);
  }

  @ApiOperation({ summary: 'Lista todos los Horarios académicos' })
  @Get()
  findAll() {
    return this.horarioService.findAll();
  }

  @ApiOperation({
    summary: 'Muestra un Horario académico, identificado por su ID',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.horarioService.findOne(+id);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({
    summary:
      'Actualiza algun dato de un Horario académico identificado por su ID',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHorarioDto: UpdateHorarioDto) {
    return this.horarioService.update(+id, updateHorarioDto);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({
    summary: 'Elimina un Horario académico identificado por su ID',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.horarioService.remove(+id);
  }
}
