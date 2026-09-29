import { Module } from '@nestjs/common';
import { GrupoService } from './grupo.service.js';
import { GrupoController } from './grupo.controller.js';

@Module({
  controllers: [GrupoController],
  providers: [GrupoService],
})
export class GrupoModule {}
