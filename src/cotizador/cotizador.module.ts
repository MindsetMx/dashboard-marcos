import { Module } from '@nestjs/common';
import { CotizadorController } from './cotizador.controller';
import { CotizadorService } from './cotizador.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisualizacionCotizador } from './entities/visualizaciones.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VisualizacionCotizador], 'cotizadorConnection'),
  ],
  controllers: [CotizadorController],
  providers: [CotizadorService]
})
export class CotizadorModule {}
