import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EntregaService } from './entrega.service.js';
import { CreateEntregaEstudianteDto } from './dto/create-entrega.dto.js';
import {
  UpdateEntregaDto,
  UpdateNotaEstudianteDto,
} from './dto/update-entrega.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('entrega')
export class EntregaController {
  constructor(private readonly entregaService: EntregaService) {}

  @Roles('ESTUDIANTE')
  @Post()
  create(@Body() createEntregaEstudianteDto: CreateEntregaEstudianteDto) {
    return this.entregaService.create(createEntregaEstudianteDto);
  }

  @Roles('ADMINISTRADOR')
  @Get()
  findAll() {
    return this.entregaService.findAll();
  }

  @Roles('ESTUDIANTE')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entregaService.findOne(+id);
  }

  @Roles('PROFESOR')
  @Patch('calificacion/:id')
  updateCalificacion(
    @Param('id') id: string,
    @Body() updateNotaEstudianteDto: UpdateNotaEstudianteDto,
  ) {
    return this.entregaService.updateCalificacion(+id, updateNotaEstudianteDto);
  }

  @Roles('ESTUDIANTE')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntregaDto: UpdateEntregaDto) {
    return this.entregaService.update(+id, updateEntregaDto);
  }

  @Roles('ADMINISTRADOR')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entregaService.remove(+id);
  }
}
