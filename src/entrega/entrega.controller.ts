import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import type { Request as RequestExpress } from 'express';
import { EntregaService } from './entrega.service.js';
import { CreateEntregaEstudianteDto } from './dto/create-entrega.dto.js';
import {
  UpdateEntregaDto,
  UpdateNotaEstudianteDto,
} from './dto/update-entrega.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { ApiOperation } from '@nestjs/swagger';
import CloudinaryService from '../cloudinary/cloudinary.service.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('entrega')
export class EntregaController {
  constructor(
    private readonly entregaService: EntregaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Roles('ESTUDIANTE')
  @ApiOperation({ summary: 'Registra o actualiza una Entrega de tarea' })
  @Post()
  create(
    @Request() req: RequestExpress,
    @Body() createEntregaEstudianteDto: CreateEntregaEstudianteDto,
  ) {
    return this.entregaService.create(req.user, createEntregaEstudianteDto);
  }

  @Roles('ESTUDIANTE','PROFESOR')
  @ApiOperation({ summary: 'Sube un archivo como Entrega de tarea' })
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async subirArchivoEntrega(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Debes adjuntar un archivo válido.');
    }

    const resultado = await this.cloudinaryService.subirArchivoTarea(file);
    return {
      url: resultado.secure_url,
      nombre_original: file.originalname,
    };
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Lista todas las Entregas de tarea' })
  @Get()
  findAll() {
    return this.entregaService.findAll();
  }

  @Roles('ESTUDIANTE')
  @ApiOperation({
    summary: 'Muestra una Entrega de tarea, identificada por su ID',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.entregaService.findOne(id);
  }

  @Roles('ESTUDIANTE')
  @ApiOperation({
    summary:
      'Actualiza algun dato de una Entrega de tarea por su ID, del Estudiante autenticado.',
  })
  @Patch('estudiante/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequestExpress,
    @Body() updateEntregaDto: UpdateEntregaDto,
  ) {
    return this.entregaService.update(id, req.user, updateEntregaDto);
  }

  @Roles('PROFESOR')
  @ApiOperation({
    summary:
      'Actualiza la Calificacion, de una Entrega de tarea identificada por su ID',
  })
  @Patch('calificacion/:id')
  updateCalificacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNotaEstudianteDto: UpdateNotaEstudianteDto,
  ) {
    return this.entregaService.updateCalificacion(id, updateNotaEstudianteDto);
  }

  @Roles('ADMINISTRADOR')
  @ApiOperation({
    summary: 'Elimina una Entrega de tarea identificada por su ID',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.entregaService.remove(id);
  }
}
