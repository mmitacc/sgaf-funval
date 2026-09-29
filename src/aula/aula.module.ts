import { Module } from '@nestjs/common';
import { AulaService } from './aula.service.js';
import { AulaController } from './aula.controller.js';

@Module({
  controllers: [AulaController],
  providers: [AulaService],
})
export class AulaModule {}
