import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PeriodoService } from './periodo.service.js';
import { CreatePeriodoDto } from './dto/create-periodo.dto.js';
import { UpdatePeriodoDto } from './dto/update-periodo.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('periodo')
export class PeriodoController {
  constructor(private readonly periodoService: PeriodoService) {}

  @Roles('ADMINISTRADOR')
  @Post()
  create(@Body() createPeriodoDto: CreatePeriodoDto) {
    return this.periodoService.create(createPeriodoDto);
  }

  @Get()
  findAll() {
    return this.periodoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.periodoService.findOne(+id);
  }

  @Roles('ADMINISTRADOR')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePeriodoDto: UpdatePeriodoDto) {
    return this.periodoService.update(+id, updatePeriodoDto);
  }

  @Roles('ADMINISTRADOR')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.periodoService.remove(+id);
  }
}
