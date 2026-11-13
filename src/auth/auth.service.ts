import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { EstudianteService } from '../estudiante/estudiante.service.js';
import { CreateEstudianteDto } from '../estudiante/dto/create-estudiante.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    private readonly estudianteService: EstudianteService,
  ) {}
  async validateUsuario(loginAuthDto: LoginAuthDto) {
    const user = await this.usuarioService.findEmail(loginAuthDto.email);
    if (!user)
      throw new UnauthorizedException(
        'Usuario no registrado, por favor valide sus datos o registrese.',
      );
    if (user?.estado === 'INACTIVO' || user.deleted === true)
      throw new UnauthorizedException(
        `Actualmente tiene el estado de ${user?.estado}, por lo que no tiene autorización para ingresar al sistema. Acerquese a Recepción para el pago y activación.`,
      );
    if (user && (await bcrypt.compare(loginAuthDto.password, user.password))) {
      const { password, ...restoUser } = user;
      return restoUser;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      nombres: user.nombres,
      apellidos: user.apellidos,
      telefono: user.telefono,
      estado: user.estado,
      foto_url: user.foto_url,
      rol: user.rol,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(createEstudianteDto: CreateEstudianteDto) {
    return await this.estudianteService.create(createEstudianteDto);
  }
}
