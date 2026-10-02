import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TareaService } from './tarea.service.js';
import { CreateTareaDto } from './dto/create-tarea.dto.js';
import { UpdateTareaDto } from './dto/update-tarea.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { ApiOperation } from '@nestjs/swagger';

@Controller('tarea')
export class TareaController {
  constructor(private readonly tareaService: TareaService) {}

  @Roles('ADMINISTRADOR', 'PROFESOR')
  @ApiOperation({ summary: 'Registra una nueva Tarea académica' })
  @Post()
  create(@Body() createTareaDto: CreateTareaDto) {
    return this.tareaService.create(createTareaDto);
  }

  @ApiOperation({ summary: 'Lista todas las Tareas académicas' })
  @Get()
  findAll() {
    return this.tareaService.findAll();
  }

  @ApiOperation({
    summary: 'Muestra una Tarea académica, identificada por su ID',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tareaService.findOne(+id);
  }

  @Roles('ADMINISTRADOR', 'PROFESOR')
  @ApiOperation({
    summary:
      'Actualiza algun dato de una Tarea académica identificada por su ID',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTareaDto: UpdateTareaDto) {
    return this.tareaService.update(+id, updateTareaDto);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({
    summary: 'Elimina una Tarea académica identificada por su ID',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tareaService.remove(+id);
  }
}
