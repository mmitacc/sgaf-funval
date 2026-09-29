import { Module } from '@nestjs/common';
import { TareaService } from './tarea.service.js';
import { TareaController } from './tarea.controller.js';

@Module({
  controllers: [TareaController],
  providers: [TareaService],
})
export class TareaModule {}
