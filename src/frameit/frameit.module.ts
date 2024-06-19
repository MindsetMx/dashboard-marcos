import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrameitService } from './frameit.service';
import { FrameitController } from './frameit.controller';
import { Order } from './entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order], 'frameit')],
  providers: [FrameitService],
  controllers: [FrameitController],
})
export class FrameitModule {}
