import { Injectable } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly usuarioService: UsuarioService) {}
  async validateUsuario(loginAuthDto: LoginAuthDto) {
    const user = await this.usuarioService.findEmail(loginAuthDto.email);
    if (user && (await bcrypt.compare(loginAuthDto.password, user.password))) {
      const { password, ...restoUser } = user;
      return restoUser;
    }
    return null;
  }
}
