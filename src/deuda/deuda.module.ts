import { Module } from '@nestjs/common';
import { DeudaService } from './deuda.service.js';
import { DeudaController } from './deuda.controller.js';

@Module({
  controllers: [DeudaController],
  providers: [DeudaService],
  exports: [DeudaService],
})
export class DeudaModule {}
