import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfesorService } from './profesor.service.js';
import { UpdateProfesorDto } from './dto/update-profesor.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { ApiOperation } from '@nestjs/swagger';

@Controller('profesor')
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) {}

  @Roles('ADMINISTRADOR', 'RECEPCIONISTA')
  @ApiOperation({ summary: 'Lista todos los Profesores' })
  @Get()
  findAll() {
    return this.profesorService.findAll();
  }

  @Roles('ADMINISTRADOR', 'RECEPCIONISTA')
  @ApiOperation({ summary: 'Muestra un Profesor identificado por su ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profesorService.findOne(+id);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({
    summary: 'Actualiza algun dato de un Profesor identificado por su ID',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfesorDto: UpdateProfesorDto,
  ) {
    return this.profesorService.update(+id, updateProfesorDto);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Elimina un Profesor identificado por su ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profesorService.remove(+id);
  }
}
