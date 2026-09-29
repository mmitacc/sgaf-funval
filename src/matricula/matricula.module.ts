import { Module } from '@nestjs/common';
import { MatriculaService } from './matricula.service.js';
import { MatriculaController } from './matricula.controller.js';

@Module({
  controllers: [MatriculaController],
  providers: [MatriculaService],
})
export class MatriculaModule {}
