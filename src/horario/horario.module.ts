import { Module } from '@nestjs/common';
import { HorarioService } from './horario.service.js';
import { HorarioController } from './horario.controller.js';

@Module({
  controllers: [HorarioController],
  providers: [HorarioService],
})
export class HorarioModule {}
