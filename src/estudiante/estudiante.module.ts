import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service.js';
import { EstudianteController } from './estudiante.controller.js';
import { UsuarioModule } from '../usuario/usuario.module.js';
import { DeudaModule } from '../deuda/deuda.module.js';
import { PeriodoModule } from '../periodo/periodo.module.js';

@Module({
  imports: [UsuarioModule, DeudaModule, PeriodoModule],
  controllers: [EstudianteController],
  providers: [EstudianteService],
  exports: [EstudianteService],
})
export class EstudianteModule {}
