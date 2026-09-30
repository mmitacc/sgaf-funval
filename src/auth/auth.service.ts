import { Injectable } from '@nestjs/common';
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
      rol: user.rol,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(createEstudianteDto: CreateEstudianteDto) {
    return await this.estudianteService.create(createEstudianteDto);
  }

}
