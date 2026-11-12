import { Module } from '@nestjs/common';
import { EntregaService } from './entrega.service.js';
import { EntregaController } from './entrega.controller.js';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.js';

@Module({
  imports:[CloudinaryModule],
  controllers: [EntregaController],
  providers: [EntregaService],
})
export class EntregaModule {}
