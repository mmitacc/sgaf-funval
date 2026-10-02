import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator.js';

@Public()
@Controller()
@ApiTags('Testing')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Verifica el estado y la disponibilidad de la API' })
  @Get()
  getOnline(): string {
    return this.appService.getOnline();
  }
}
