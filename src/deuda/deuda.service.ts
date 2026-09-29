import { Injectable } from '@nestjs/common';
import { CreateDeudaDto } from './dto/create-deuda.dto.js';
import { UpdateDeudaDto } from './dto/update-deuda.dto.js';

@Injectable()
export class DeudaService {
  create(createDeudaDto: CreateDeudaDto) {
    return 'This action adds a new deuda';
  }

  findAll() {
    return `This action returns all deuda`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deuda`;
  }

  update(id: number, updateDeudaDto: UpdateDeudaDto) {
    return `This action updates a #${id} deuda`;
  }

  remove(id: number) {
    return `This action removes a #${id} deuda`;
  }
}
