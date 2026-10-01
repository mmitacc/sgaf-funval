import { Module } from '@nestjs/common';
import { PagoService } from './pago.service.js';
import { PagoController } from './pago.controller.js';

@Module({
  controllers: [PagoController],
  providers: [PagoService],
})
export class PagoModule {}
