import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service.js';
import { EstudianteController } from './estudiante.controller.js';

@Module({
  controllers: [EstudianteController],
  providers: [EstudianteService],
  exports: [EstudianteService],
})
export class EstudianteModule {}
