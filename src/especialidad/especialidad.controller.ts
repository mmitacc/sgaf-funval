import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EspecialidadService } from './especialidad.service.js';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto.js';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { ApiOperation } from '@nestjs/swagger';

@Controller('especialidad')
export class EspecialidadController {
  constructor(private readonly especialidadService: EspecialidadService) {}

  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Registra una nueva Especialidad del profesor' })
  @Post()
  create(@Body() createEspecialidadDto: CreateEspecialidadDto) {
    return this.especialidadService.create(createEspecialidadDto);
  }

  @Roles('ADMINISTRADOR', 'PROFESOR', 'RECEPCIONISTA')
  @ApiOperation({ summary: 'Lista todas las Especialidades del profesor' })
  @Get()
  findAll() {
    return this.especialidadService.findAll();
  }

  @Roles('ADMINISTRADOR', 'PROFESOR', 'RECEPCIONISTA')
  @ApiOperation({
    summary: 'Muestra una Especialidad del profesor, identificada por su ID',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.especialidadService.findOne(+id);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({
    summary:
      'Actualiza algun dato de una Especialidad del profesor identificada por su ID',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEspecialidadDto: UpdateEspecialidadDto,
  ) {
    return this.especialidadService.update(+id, updateEspecialidadDto);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({
    summary: 'Elimina una Especialidad del profesor identificada por su ID',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.especialidadService.remove(+id);
  }
}
