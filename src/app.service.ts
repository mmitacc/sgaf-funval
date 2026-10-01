import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getOnline(): string {
    return 'Backend API RestFull SGAF-FUNVAL ... Successfully online!';
  }
}
