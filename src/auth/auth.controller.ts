import {
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  Post,
  Get,
  Request,
  Body,
  Req,
  Put,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import type { Request as RequestExpress } from 'express';
import { LoginAuthDto } from './dto/login-auth.dto.js';
import { AuthService } from './auth.service.js';
import { Public } from '../common/decorators/public.decorator.js';
import { CreateEstudianteDto } from '../estudiante/dto/create-estudiante.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import CloudinaryService from '../cloudinary/cloudinary.service.js';
import { UsuarioService } from '../usuario/usuario.service.js';
import { ApiOperation } from '@nestjs/swagger';
import { UpdatePerfilDto } from '../usuario/dto/update-usuario.dto.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly usuarioService: UsuarioService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'Autentica a un usuario registrado y genera un token de acceso.',
  })
  @Post('login')
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Request() req: RequestExpress,
  ) {
    return await this.authService.login(req.user);
  }

  @Public()
  @ApiOperation({ summary: 'Registra a un nuevo Estudiante.' })
  @Post('register')
  async register(@Body() createEstudianteDto: CreateEstudianteDto) {
    return await this.authService.register(createEstudianteDto);
  }

  @Put('perfil')
  @UseInterceptors(FileInterceptor('foto')) // Captura el archivo en memoria RAM
  async actualizarPerfil(
    @Req() req: any,
    @Body() datosDto: UpdatePerfilDto,
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
      nombres: datosDto.nombres,
      apellidos: datosDto.apellidos,
      telefono: datosDto.telefono,
      foto: urlFoto,
    });
  }

  @ApiOperation({
    summary: 'Muestra los datos del perfil del usuario autenticado.',
  })
  @Get('profile')
  async profile(@Req() req: RequestExpress) {
    return req.user;
  }
}
