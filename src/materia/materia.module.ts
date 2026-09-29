import { Module } from '@nestjs/common';
import { MateriaService } from './materia.service.js';
import { MateriaController } from './materia.controller.js';

@Module({
  controllers: [MateriaController],
  providers: [MateriaService],
})
export class MateriaModule {}
