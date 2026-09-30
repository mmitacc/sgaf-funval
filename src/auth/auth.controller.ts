import {
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  Post,
  Request,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import type { Request as RequestExpress } from 'express';
import { LoginAuthDto } from './dto/login-auth.dto.js';
import { AuthService } from './auth.service.js';
import { Public } from '../common/decorators/public.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Request() req: RequestExpress,
  ) {
    return this.authService.login(req.user);
  }
}
