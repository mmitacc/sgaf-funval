import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { DeudaService } from './deuda.service.js';
import { CreateDeudaDto } from './dto/create-deuda.dto.js';
import { UpdateDeudaDto } from './dto/update-deuda.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import type { Request as RequestExpress } from 'express';

@Controller('deuda')
export class DeudaController {
  constructor(private readonly deudaService: DeudaService) {}

  @Roles('ADMINISTRADOR')
  @Post()
  create(@Body() createDeudaDto: CreateDeudaDto) {
    return this.deudaService.create(createDeudaDto);
  }

  @Roles('ADMINISTRADOR')
  @Get()
  findAll() {
    return this.deudaService.findAll();
  }

  //Endpoint para ejecutar el corte de morosos bajo demanda.
  @Roles('ADMINISTRADOR')
  @Post('corte-mensual')
  @HttpCode(HttpStatus.OK)
  async forzarCorte() {
    const totalAfectados = await this.deudaService.forzarCorteManual();
    return {
      success: true,
      message: 'Proceso de suspensión por morosidad ejecutado manualmente.',
      estudiantesSuspendidos: totalAfectados,
    };
  }

  @Roles('ESTUDIANTE')
  @Get('estudiante')
  findEstudiante(@Request() req: RequestExpress) {
    return this.deudaService.findEstudiante(req.user);
  }

  @Roles('RECEPCIONISTA')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deudaService.findOne(+id);
  }

  @Roles('ADMINISTRADOR')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeudaDto: UpdateDeudaDto) {
    return this.deudaService.update(+id, updateDeudaDto);
  }

  @Roles('ADMINISTRADOR')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deudaService.remove(+id);
  }
}
