import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service.js';
import { UsuarioController } from './usuario.controller.js';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.js';

@Module({
  imports:[CloudinaryModule],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
