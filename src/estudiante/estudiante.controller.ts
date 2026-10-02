import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstudianteService } from './estudiante.service.js';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('estudiante')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Roles('ADMINISTRADOR', 'PROFESOR', 'RECEPCIONISTA')
  @Get()
  findAll() {
    return this.estudianteService.findAll();
  }

  @Roles('ADMINISTRADOR', 'PROFESOR', 'RECEPCIONISTA')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estudianteService.findOne(+id);
  }

  @Roles('RECEPCIONISTA')
  @Patch('activar/:id')
  updateEstadoEstudiante(@Param('id') id: string) {
    return this.estudianteService.updateEstado(+id);
  }

  @Roles('ADMINISTRADOR')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEstudianteDto: UpdateEstudianteDto,
  ) {
    return this.estudianteService.update(+id, updateEstudianteDto);
  }

  @Roles('ADMINISTRADOR')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estudianteService.remove(+id);
  }
}
