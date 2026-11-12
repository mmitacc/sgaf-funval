import { Module } from '@nestjs/common';
import { MatriculaService } from './matricula.service.js';
import { MatriculaController } from './matricula.controller.js';
import { EstudianteModule } from '../estudiante/estudiante.module.js';

@Module({
  imports:[EstudianteModule],
  controllers: [MatriculaController],
  providers: [MatriculaService],
})
export class MatriculaModule {}
