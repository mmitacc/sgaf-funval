import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MaterialGrupoService } from './material-grupo.service.js';
import { CreateMaterialGrupoDto } from './dto/create-material-grupo.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { ApiOperation } from '@nestjs/swagger';

@Controller('material-grupo')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MaterialGrupoController {
  constructor(private readonly materialService: MaterialGrupoService) {}

  @ApiOperation({
    summary: 'Crea un Material de Estudio para un grupo academico',
  })
  @Post()
  @Roles('PROFESOR')
  crear(@Body() dto: CreateMaterialGrupoDto, @Req() req: any) {
    return this.materialService.crear(dto, req.user.id);
  }

  @ApiOperation({
    summary:
      'Muestra los Materiales de Estudio para un grupo academico identificado por su idGrupo',
  })
  @Get('grupo/:idGrupo')
  @Roles('PROFESOR', 'ESTUDIANTE')
  listarPorGrupo(@Param('idGrupo', ParseIntPipe) idGrupo: number) {
    return this.materialService.listarPorGrupo(idGrupo);
  }

  @ApiOperation({
    summary:
      'Elimina un Material de Estudio de un grupo academico por idMaterialEstudio',
  })
  @Delete(':id')
  @Roles('PROFESOR')
  eliminar(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.materialService.eliminar(id, req.user.id);
  }
}
