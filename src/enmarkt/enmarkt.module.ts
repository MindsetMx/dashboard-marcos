import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnmarktService } from './enmarkt.service';
import { EnmarktController } from './enmarkt.controller';
import { Venta } from './entities/venta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta], 'enmarktConnection'),
  ],
  providers: [EnmarktService],
  controllers: [EnmarktController],
})
export class EnmarktModule {}
