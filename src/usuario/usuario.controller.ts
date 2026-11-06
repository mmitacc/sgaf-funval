import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Req,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import CloudinaryService from '../cloudinary/cloudinary.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Roles('ADMINISTRADOR')
@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Put('perfil')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('foto')) // Captura el archivo en memoria RAM
  async actualizarPerfil(
    @Req() req: any,
    @Body() datosDto: { nombre: string; telefono?: string },
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
    const usuarioId = req.user.id;
    let urlFoto: string | undefined = undefined;

    if (file) {
      const resultadoCloudinary =
        await this.cloudinaryService.subirImagen(file);
      urlFoto = resultadoCloudinary.secure_url; // URL segura HTTPS
    }

    return this.usuarioService.actualizarPerfil(usuarioId, {
      nombre: datosDto.nombre,
      telefono: datosDto.telefono,
      foto: urlFoto,
    });
  }

  @ApiOperation({ summary: 'Registra un nuevo Usuario' })
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
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
    summary: 'Actualiza algun dato de un Usuario identificado por su ID',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }

  @ApiOperation({ summary: 'Elimina un Usuario identificado por su ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }
}
