import { Module } from '@nestjs/common';
import { ProfesorService } from './profesor.service.js';
import { ProfesorController } from './profesor.controller.js';

@Module({
  controllers: [ProfesorController],
  providers: [ProfesorService],
})
export class ProfesorModule {}
