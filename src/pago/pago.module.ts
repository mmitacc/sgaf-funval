import { Module } from '@nestjs/common';
import { PagoService } from './pago.service.js';
import { PagoController } from './pago.controller.js';
import { DeudaModule } from '../deuda/deuda.module.js';
import { PeriodoModule } from '../periodo/periodo.module.js';
import { EstudianteModule } from '../estudiante/estudiante.module.js';

@Module({
  imports: [DeudaModule, PeriodoModule, EstudianteModule],
  controllers: [PagoController],
  providers: [PagoService],
})
export class PagoModule {}
