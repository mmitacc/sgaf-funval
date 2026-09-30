import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator.js';

@Public()
@Controller()
@ApiTags('Testing')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getOnline(): string {
    return this.appService.getOnline();
  }
}
