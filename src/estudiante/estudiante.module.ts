import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service.js';
import { EstudianteController } from './estudiante.controller.js';
import { UsuarioModule } from '../usuario/usuario.module.js';

@Module({
  imports: [UsuarioModule],
  controllers: [EstudianteController],
  providers: [EstudianteService],
  exports: [EstudianteService],
})
export class EstudianteModule {}
