import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GrupoService } from './grupo.service.js';
import { CreateGrupoDto } from './dto/create-grupo.dto.js';
import { UpdateGrupoDto } from './dto/update-grupo.dto.js';

@Controller('grupo')
export class GrupoController {
  constructor(private readonly grupoService: GrupoService) {}

  @Post()
  create(@Body() createGrupoDto: CreateGrupoDto) {
    return this.grupoService.create(createGrupoDto);
  }

  @Get()
  findAll() {
    return this.grupoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grupoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGrupoDto: UpdateGrupoDto) {
    return this.grupoService.update(+id, updateGrupoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.grupoService.remove(+id);
  }
}
