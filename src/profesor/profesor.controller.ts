import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfesorService } from './profesor.service.js';
import { UpdateProfesorDto } from './dto/update-profesor.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('profesor')
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) {}

  @Roles('ADMINISTRADOR', 'RECEPCIONISTA')
  @Get()
  findAll() {
    return this.profesorService.findAll();
  }

  @Roles('ADMINISTRADOR', 'RECEPCIONISTA')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profesorService.findOne(+id);
  }

  @Roles('ADMINISTRADOR')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfesorDto: UpdateProfesorDto,
  ) {
    return this.profesorService.update(+id, updateProfesorDto);
  }

  @Roles('ADMINISTRADOR')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profesorService.remove(+id);
  }
}
