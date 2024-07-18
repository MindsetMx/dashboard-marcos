import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImpresionesService } from './impresiones.service';
import { ImpresionesController } from './impresiones.controller';
import { Pedido } from './entities/pedido.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido], 'impresionesConnection'),
  ],
  providers: [ImpresionesService],
  controllers: [ImpresionesController],
})
export class ImpresionesModule {}
