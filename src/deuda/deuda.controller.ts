import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeudaService } from './deuda.service.js';
import { CreateDeudaDto } from './dto/create-deuda.dto.js';
import { UpdateDeudaDto } from './dto/update-deuda.dto.js';

@Controller('deuda')
export class DeudaController {
  constructor(private readonly deudaService: DeudaService) {}

  @Post()
  create(@Body() createDeudaDto: CreateDeudaDto) {
    return this.deudaService.create(createDeudaDto);
  }

  @Get()
  findAll() {
    return this.deudaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deudaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeudaDto: UpdateDeudaDto) {
    return this.deudaService.update(+id, updateDeudaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deudaService.remove(+id);
  }
}
