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

@Controller('tarea')
export class TareaController {
  constructor(private readonly tareaService: TareaService) {}

  @Roles('ADMINISTRADOR', 'PROFESOR')
  @Post()
  create(@Body() createTareaDto: CreateTareaDto) {
    return this.tareaService.create(createTareaDto);
  }

  @Get()
  findAll() {
    return this.tareaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tareaService.findOne(+id);
  }

  @Roles('ADMINISTRADOR', 'PROFESOR')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTareaDto: UpdateTareaDto) {
    return this.tareaService.update(+id, updateTareaDto);
  }

  @Roles('ADMINISTRADOR')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tareaService.remove(+id);
  }
}
