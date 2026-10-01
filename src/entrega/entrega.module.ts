import { Module } from '@nestjs/common';
import { EntregaService } from './entrega.service.js';
import { EntregaController } from './entrega.controller.js';

@Module({
  controllers: [EntregaController],
  providers: [EntregaService],
})
export class EntregaModule {}
