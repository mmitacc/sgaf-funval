import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AulaService } from './aula.service.js';
import { CreateAulaDto } from './dto/create-aula.dto.js';
import { UpdateAulaDto } from './dto/update-aula.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { ApiOperation } from '@nestjs/swagger';

@Controller('aula')
export class AulaController {
  constructor(private readonly aulaService: AulaService) {}

  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Registra una nueva Aula' })
  @Post()
  create(@Body() createAulaDto: CreateAulaDto) {
    return this.aulaService.create(createAulaDto);
  }

  @ApiOperation({ summary: 'Lista todas las Aulas' })
  @Get()
  findAll() {
    return this.aulaService.findAll();
  }

  @ApiOperation({ summary: 'Muestra una Aula, identificada por su ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aulaService.findOne(+id);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({
    summary: 'Actualiza algun dato de una Aula identificada por su ID',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAulaDto: UpdateAulaDto) {
    return this.aulaService.update(+id, updateAulaDto);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Elimina una Aula identificada por su ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aulaService.remove(+id);
  }
}
