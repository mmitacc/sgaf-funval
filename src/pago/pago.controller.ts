import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PagoService } from './pago.service.js';
import { CreatePagoDto, PagoMatriculaDto } from './dto/create-pago.dto.js';
import { UpdatePagoDto } from './dto/update-pago.dto.js';
import type { Request as RequestExpress } from 'express';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('pago')
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Roles('ADMINISTRADOR', 'RECEPCIONISTA', 'ESTUDIANTE')
  @Post()
  create(@Req() req: RequestExpress, @Body() createPagoDto: CreatePagoDto) {
    return this.pagoService.create(req.user, createPagoDto);
  }

  @Roles('ADMINISTRADOR', 'RECEPCIONISTA')
  @Get()
  findAll() {
    return this.pagoService.findAll();
  }

  @Roles('ADMINISTRADOR', 'RECEPCIONISTA')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagoService.findOne(+id);
  }

  @Roles('ADMINISTRADOR', 'RECEPCIONISTA')
  @Post('matricula')
  @HttpCode(HttpStatus.OK)
  findPagoMatricula(@Body() pagoMatriculaDto: PagoMatriculaDto) {
    return this.pagoService.findPagoMatricula(pagoMatriculaDto);
  }

  @Roles('ADMINISTRADOR')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePagoDto: UpdatePagoDto) {
    return this.pagoService.update(+id, updatePagoDto);
  }

  @Roles('ADMINISTRADOR')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagoService.remove(+id);
  }
}
