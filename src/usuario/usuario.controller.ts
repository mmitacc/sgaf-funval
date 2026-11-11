import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsuarioService } from './usuario.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { ApiOperation } from '@nestjs/swagger';
import CloudinaryService from '../cloudinary/cloudinary.service.js';

@Roles('ADMINISTRADOR')
@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @ApiOperation({ summary: 'Registra un nuevo Usuario' })
  @Post()
  @UseInterceptors(FileInterceptor('foto'))
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    let urlFoto = createUsuarioDto.foto_url;

    if (file) {
      const resultadoCloudinary =
        await this.cloudinaryService.subirImagen(file);
      urlFoto = resultadoCloudinary.secure_url;
    }

    return await this.usuarioService.create({
      ...createUsuarioDto,
      foto_url: urlFoto,
    });
  }

  @ApiOperation({ summary: 'Lista todos los Usuarios' })
  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @ApiOperation({ summary: 'Muestra un Usuario, identificado por su ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Resetea la contraseña de un usuario a INICIALES.usuario123',
  })
  @Patch('reset-password/:id')
  async resetearPassword(@Param('id', ParseIntPipe) id: number) {
    return await this.usuarioService.resetearPassword(id);
  }

  @ApiOperation({
    summary: 'Actualiza algun dato de un Usuario identificado por su ID',
  })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('foto'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    let urlFoto = updateUsuarioDto.foto_url;

    if (file) {
      const resultadoCloudinary =
        await this.cloudinaryService.subirImagen(file);
      urlFoto = resultadoCloudinary.secure_url;
    }

    return await this.usuarioService.update(id, {
      ...updateUsuarioDto,
      ...(urlFoto && { foto_url: urlFoto }),
    });
  }

  @ApiOperation({ summary: 'Elimina un Usuario identificado por su ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }
}
