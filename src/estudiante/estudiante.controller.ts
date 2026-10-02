import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstudianteService } from './estudiante.service.js';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { ApiOperation } from '@nestjs/swagger';

@Controller('estudiante')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Roles('ADMINISTRADOR', 'PROFESOR', 'RECEPCIONISTA')
  @ApiOperation({ summary: 'Lista todos la Estudiantes' })
  @Get()
  findAll() {
    return this.estudianteService.findAll();
  }

  @Roles('ADMINISTRADOR', 'PROFESOR', 'RECEPCIONISTA')
  @ApiOperation({ summary: 'Muestra un Estudiante, identificado por su ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estudianteService.findOne(+id);
  }

  @Roles('RECEPCIONISTA')
  @ApiOperation({
    summary: 'Cambia el estado=ACTIVO de un Estudiante identificado por su ID',
  })
  @Patch('activar/:id')
  updateEstadoEstudiante(@Param('id') id: string) {
    return this.estudianteService.updateEstado(+id);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({
    summary: 'Actualiza algun dato de un Estudiante identificado por su ID',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEstudianteDto: UpdateEstudianteDto,
  ) {
    return this.estudianteService.update(+id, updateEstudianteDto);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Elimina un Estudiante identificado por su ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estudianteService.remove(+id);
  }
}
