import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MateriaService } from './materia.service.js';
import { CreateMateriaDto } from './dto/create-materia.dto.js';
import { UpdateMateriaDto } from './dto/update-materia.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { ApiOperation } from '@nestjs/swagger';

@Controller('materia')
export class MateriaController {
  constructor(private readonly materiaService: MateriaService) {}

  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Registra una nueva Materia de estudio' })
  @Post()
  create(@Body() createMateriaDto: CreateMateriaDto) {
    return this.materiaService.create(createMateriaDto);
  }

  @ApiOperation({ summary: 'Lista todas las Materias de estudio' })
  @Get()
  findAll() {
    return this.materiaService.findAll();
  }

  @ApiOperation({
    summary: 'Muestra una Materia de estudio, identificada por su ID',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materiaService.findOne(+id);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({
    summary:
      'Actualiza algun dato de una Materia de estudio identificada por su ID',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMateriaDto: UpdateMateriaDto) {
    return this.materiaService.update(+id, updateMateriaDto);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({
    summary: 'Elimina una Materia de estudio identificada por su ID',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materiaService.remove(+id);
  }
}
