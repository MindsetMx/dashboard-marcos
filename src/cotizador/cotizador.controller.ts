import { Controller, Get, Query } from '@nestjs/common';
import { CotizadorService } from './cotizador.service';

@Controller('cotizador')
export class CotizadorController {
  constructor(private readonly cotizadorService: CotizadorService) {}

  @Get('visualizaciones')
  async findAll(
    @Query('size') size: number = 10,
    @Query('page') page: number = 1,
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string,
    @Query('orderBy') orderBy: 1 | -1 = 1,
  ) {
    return this.cotizadorService.findAll({
      size,
      page,
      dateStart,
      dateEnd,
      orderBy,
    });
  }


  @Get('top-colecciones')
  async getTopColecciones(
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string,
    @Query('orderBy') orderBy: 1 | -1 = 1,
  ) {
    return this.cotizadorService.getTopColecciones({
      dateStart,
      dateEnd,
      orderBy,
    });
  }

  @Get('top-molduras')
  async getTopMolduras(
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string,
    @Query('orderBy') orderBy: 1 | -1 = 1,
  ) {
    return this.cotizadorService.getTopMolduras({
      dateStart,
      dateEnd,
      orderBy,
    });
  }

  @Get('top-cartulina')
  async getTopMoldurasCartulina(
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string,
    @Query('orderBy') orderBy: 1 | -1 = 1,
  ) {
    return this.cotizadorService.getTopMoldurasCartulina({
      dateStart,
      dateEnd,
      orderBy,
    });
  }

  @Get('top-tipos')
  async getTopTipos(
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string,
    @Query('orderBy') orderBy: 1 | -1 = 1,
  ) {
    return this.cotizadorService.getTopTipos({
      dateStart,
      dateEnd,
      orderBy,
    });
  }

  @Get('top-clientes')
  async getTopClientes(
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string,
    @Query('orderBy') orderBy: 1 | -1 = 1,
  ) {
    return this.cotizadorService.getTopClientes({
      dateStart,
      dateEnd,
      orderBy,
    });
  }

  @Get('top-medida-cartulina')
  async getTopColeccionesCartulina(
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string,
    @Query('orderBy') orderBy: 1 | -1 = 1,
  ) {
    return this.cotizadorService.getTopColeccionesCartulina({
      dateStart,
      dateEnd,
      orderBy,
    });
  }
}
