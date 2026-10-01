import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { PagoService } from './pago.service.js';
import { CreatePagoDto } from './dto/create-pago.dto.js';
import { UpdatePagoDto } from './dto/update-pago.dto.js';
import type { Request as RequestExpress } from 'express';

@Controller('pago')
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Post()
  create(@Req() req: RequestExpress, @Body() createPagoDto: CreatePagoDto) {
    return this.pagoService.create(req.user, createPagoDto);
  }

  @Get()
  findAll() {
    return this.pagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePagoDto: UpdatePagoDto) {
    return this.pagoService.update(+id, updatePagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagoService.remove(+id);
  }
}
