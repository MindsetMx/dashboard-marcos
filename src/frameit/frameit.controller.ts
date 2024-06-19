import { Controller, Get, Param, Delete } from '@nestjs/common';
import { FrameitService } from './frameit.service';
import { Order } from './entities/order.entity';

@Controller('frameit')
export class FrameitController {
  constructor(private readonly frameitService: FrameitService) {}

  @Get('orders')
  findAll(): Promise<Order[]> {
    return this.frameitService.findAll();
  }

  @Get('orders/:id')
  findOne(@Param('id') id: number): Promise<Order> {
    return this.frameitService.findOne(id);
  }

  @Delete('orders/:id')
  remove(@Param('id') id: number): Promise<void> {
    return this.frameitService.remove(id);
  }
}
