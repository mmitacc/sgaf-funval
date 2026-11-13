import { Module } from '@nestjs/common';
import { MaterialGrupoService } from './material-grupo.service.js';
import { MaterialGrupoController } from './material-grupo.controller.js';
import { GrupoModule } from '../grupo/grupo.module.js';

@Module({imports:[GrupoModule],
  controllers: [MaterialGrupoController],
  providers: [MaterialGrupoService],
})
export class MaterialGrupoModule {}
