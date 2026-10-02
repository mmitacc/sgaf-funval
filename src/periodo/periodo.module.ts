import { Module } from '@nestjs/common';
import { PeriodoService } from './periodo.service.js';
import { PeriodoController } from './periodo.controller.js';

@Module({
  controllers: [PeriodoController],
  providers: [PeriodoService],
  exports: [PeriodoService],
})
export class PeriodoModule {}
