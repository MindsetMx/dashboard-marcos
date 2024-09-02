import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisualizacionCotizador } from './entities/visualizaciones.entity';

@Injectable()
export class CotizadorService {
  constructor(
    @InjectRepository(VisualizacionCotizador, 'cotizadorConnection')
    private visualizacionCotizadorRepository: Repository<VisualizacionCotizador>,
  ) {}

  async findAll(params: {
    size: number;
    page: number;
    dateStart?: string;
    dateEnd?: string;
    orderBy?: 1 | -1;
  }): Promise<{
    data: any[];
    meta: { total: number; page: number; size: number };
  }> {
    const { size, page, dateStart, dateEnd, orderBy } = params;

    const query = this.visualizacionCotizadorRepository.createQueryBuilder('visualizacion');

    // Filtro de fechas
    if (dateStart) {
      query.andWhere('visualizacion.created_at >= :dateStart', { dateStart });
    }

    if (dateEnd) {
      query.andWhere('visualizacion.created_at <= :dateEnd', { dateEnd });
    }

    // Ordenamiento
    const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
    query.orderBy('visualizacion.created_at', orderDirection);

    // Paginación
    query.skip((page - 1) * size).take(size);

    const [result, total] = await query.getManyAndCount();

    // Transformar `datos_consulta` de string a JSON y extraer campos
    const transformedData = result.map((visualizacion) => {
      const datos = JSON.parse(visualizacion.datos_consulta);

      return {
        id: visualizacion.id,
        num_cliente: datos.num_cliente,
        tipo: datos.tipo,
        coleccion: datos.coleccion,
        moldura: datos.moldura,
        medidas: datos.medidas || {},
        created_at: visualizacion.created_at,
        updated_at: visualizacion.updated_at,
      };
    });

    return {
      data: transformedData,
      meta: { total, page, size },
    };
  }



  async getTopColecciones(params: {
    dateStart?: string;
    dateEnd?: string;
    orderBy?: 1 | -1;
  }): Promise<{ data: any[]; meta: { total: number } }> {
    const { dateStart, dateEnd, orderBy } = params;

    const query = this.visualizacionCotizadorRepository.createQueryBuilder('visualizacion');

    // Filtro de fechas
    if (dateStart) {
      query.andWhere('visualizacion.created_at >= :dateStart', { dateStart });
    }

    if (dateEnd) {
      query.andWhere('visualizacion.created_at <= :dateEnd', { dateEnd });
    }

    // Filtrar por tipos específicos
    query.andWhere(
      'visualizacion.datos_consulta LIKE :tipo1 OR visualizacion.datos_consulta LIKE :tipo2 OR visualizacion.datos_consulta LIKE :tipo3',
      {
        tipo1: '%"tipo":"marco-armado"%',
        tipo2: '%"tipo":"barra"%',
        tipo3: '%"tipo":"caja"%',
      },
    );

    // Ordenamiento
    const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
    query.orderBy('visualizacion.created_at', orderDirection);

    const result = await query.getMany();

    // Transformar `datos_consulta` de string a JSON y contar colecciones
    const coleccionesCount = {};
    result.forEach((visualizacion) => {
      const datos = JSON.parse(visualizacion.datos_consulta);
      if (datos.coleccion) {
        if (!coleccionesCount[datos.coleccion]) {
          coleccionesCount[datos.coleccion] = 0;
        }
        coleccionesCount[datos.coleccion]++;
      }
    });

    // Convertir el objeto de colecciones en un array y ordenar
    const sortedColecciones = Object.keys(coleccionesCount)
      .map((coleccion) => ({ coleccion, count: coleccionesCount[coleccion] }))
      .sort((a, b) => b.count - a.count);

    return {
      data: sortedColecciones,
      meta: { total: sortedColecciones.length },
    };
  }


  async getTopMolduras(params: {
    dateStart?: string;
    dateEnd?: string;
    orderBy?: 1 | -1;
  }): Promise<{ data: any[]; meta: { total: number } }> {
    const { dateStart, dateEnd, orderBy } = params;

    const query = this.visualizacionCotizadorRepository.createQueryBuilder('visualizacion');

    // Filtro de fechas
    if (dateStart) {
      query.andWhere('visualizacion.created_at >= :dateStart', { dateStart });
    }

    if (dateEnd) {
      query.andWhere('visualizacion.created_at <= :dateEnd', { dateEnd });
    }

    // Filtrar por tipos específicos
    query.andWhere(
      'visualizacion.datos_consulta LIKE :tipo1 OR visualizacion.datos_consulta LIKE :tipo2 OR visualizacion.datos_consulta LIKE :tipo3',
      {
        tipo1: '%"tipo":"marco-armado"%',
        tipo2: '%"tipo":"barra"%',
        tipo3: '%"tipo":"caja"%',
      },
    );

    // Ordenamiento
    const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
    query.orderBy('visualizacion.created_at', orderDirection);

    const result = await query.getMany();

    // Transformar `datos_consulta` de string a JSON y contar molduras
    const moldurasCount = {};
    result.forEach((visualizacion) => {
      const datos = JSON.parse(visualizacion.datos_consulta);
      if (datos.moldura) {
        if (!moldurasCount[datos.moldura]) {
          moldurasCount[datos.moldura] = 0;
        }
        moldurasCount[datos.moldura]++;
      }
    });

    // Convertir el objeto de molduras en un array y ordenar
    const sortedMolduras = Object.keys(moldurasCount)
      .map((moldura) => ({ moldura, count: moldurasCount[moldura] }))
      .sort((a, b) => b.count - a.count);

    return {
      data: sortedMolduras,
      meta: { total: sortedMolduras.length },
    };
  }


  async getTopMoldurasCartulina(params: {
    dateStart?: string;
    dateEnd?: string;
    orderBy?: 1 | -1;
  }): Promise<{ data: any[]; meta: { total: number } }> {
    const { dateStart, dateEnd, orderBy } = params;

    const query = this.visualizacionCotizadorRepository.createQueryBuilder('visualizacion');

    // Filtro de fechas
    if (dateStart) {
      query.andWhere('visualizacion.created_at >= :dateStart', { dateStart });
    }

    if (dateEnd) {
      query.andWhere('visualizacion.created_at <= :dateEnd', { dateEnd });
    }

    // Filtrar por tipo "cartulina"
    query.andWhere('visualizacion.datos_consulta LIKE :tipo', {
      tipo: '%"tipo":"cartulina"%',
    });

    // Ordenamiento
    const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
    query.orderBy('visualizacion.created_at', orderDirection);

    const result = await query.getMany();

    // Transformar `datos_consulta` de string a JSON y contar molduras
    const moldurasCount = {};
    result.forEach((visualizacion) => {
      const datos = JSON.parse(visualizacion.datos_consulta);
      if (datos.moldura) {
        if (!moldurasCount[datos.moldura]) {
          moldurasCount[datos.moldura] = 0;
        }
        moldurasCount[datos.moldura]++;
      }
    });

    // Convertir el objeto de molduras en un array y ordenar
    const sortedMolduras = Object.keys(moldurasCount)
      .map((moldura) => ({ moldura, count: moldurasCount[moldura] }))
      .sort((a, b) => b.count - a.count);

    return {
      data: sortedMolduras,
      meta: { total: sortedMolduras.length },
    };
  }

  async getTopTipos(params: {
    dateStart?: string;
    dateEnd?: string;
    orderBy?: 1 | -1;
  }): Promise<{ data: any[]; meta: { total: number } }> {
    const { dateStart, dateEnd, orderBy } = params;

    const query = this.visualizacionCotizadorRepository.createQueryBuilder('visualizacion');

    // Filtro de fechas
    if (dateStart) {
      query.andWhere('visualizacion.created_at >= :dateStart', { dateStart });
    }

    if (dateEnd) {
      query.andWhere('visualizacion.created_at <= :dateEnd', { dateEnd });
    }

    // Ordenamiento
    const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
    query.orderBy('visualizacion.created_at', orderDirection);

    const result = await query.getMany();

    // Transformar `datos_consulta` de string a JSON y contar tipos
    const tiposCount = {};
    result.forEach((visualizacion) => {
      const datos = JSON.parse(visualizacion.datos_consulta);
      if (datos.tipo) {
        if (!tiposCount[datos.tipo]) {
          tiposCount[datos.tipo] = 0;
        }
        tiposCount[datos.tipo]++;
      }
    });

    // Convertir el objeto de tipos en un array y ordenar
    const sortedTipos = Object.keys(tiposCount)
      .map((tipo) => ({ tipo, count: tiposCount[tipo] }))
      .sort((a, b) => b.count - a.count);

    return {
      data: sortedTipos,
      meta: { total: sortedTipos.length },
    };
  }


  async getTopClientes(params: {
    dateStart?: string;
    dateEnd?: string;
    orderBy?: 1 | -1;
  }): Promise<{ data: any[]; meta: { total: number } }> {
    const { dateStart, dateEnd, orderBy } = params;

    const query = this.visualizacionCotizadorRepository.createQueryBuilder('visualizacion');

    // Filtro de fechas
    if (dateStart) {
      query.andWhere('visualizacion.created_at >= :dateStart', { dateStart });
    }

    if (dateEnd) {
      query.andWhere('visualizacion.created_at <= :dateEnd', { dateEnd });
    }

    // Ordenamiento
    const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
    query.orderBy('visualizacion.created_at', orderDirection);

    const result = await query.getMany();

    // Transformar `datos_consulta` de string a JSON y contar números de cliente
    const clientesCount = {};
    result.forEach((visualizacion) => {
      const datos = JSON.parse(visualizacion.datos_consulta);
      if (datos.num_cliente) {
        if (!clientesCount[datos.num_cliente]) {
          clientesCount[datos.num_cliente] = 0;
        }
        clientesCount[datos.num_cliente]++;
      }
    });

    // Convertir el objeto de clientes en un array y ordenar
    const sortedClientes = Object.keys(clientesCount)
      .map((num_cliente) => ({ num_cliente, count: clientesCount[num_cliente] }))
      .sort((a, b) => b.count - a.count);

    return {
      data: sortedClientes,
      meta: { total: sortedClientes.length },
    };
  }

  async getTopColeccionesCartulina(params: {
    dateStart?: string;
    dateEnd?: string;
    orderBy?: 1 | -1;
  }): Promise<{ data: any[]; meta: { total: number } }> {
    const { dateStart, dateEnd, orderBy } = params;

    const query = this.visualizacionCotizadorRepository.createQueryBuilder('visualizacion');

    // Filtro de fechas
    if (dateStart) {
      query.andWhere('visualizacion.created_at >= :dateStart', { dateStart });
    }

    if (dateEnd) {
      query.andWhere('visualizacion.created_at <= :dateEnd', { dateEnd });
    }

    // Ordenamiento
    const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
    query.orderBy('visualizacion.created_at', orderDirection);

    const result = await query.getMany();

    // Transformar `datos_consulta` de string a JSON y contar colecciones para "cartulina"
    const coleccionesCount = {};
    result.forEach((visualizacion) => {
      const datos = JSON.parse(visualizacion.datos_consulta);
      if (datos.tipo === 'cartulina' && datos.coleccion) {
        if (!coleccionesCount[datos.coleccion]) {
          coleccionesCount[datos.coleccion] = 0;
        }
        coleccionesCount[datos.coleccion]++;
      }
    });

    // Convertir el objeto de colecciones en un array y ordenar
    const sortedColecciones = Object.keys(coleccionesCount)
      .map((coleccion) => ({ coleccion, count: coleccionesCount[coleccion] }))
      .sort((a, b) => b.count - a.count);

    return {
      data: sortedColecciones,
      meta: { total: sortedColecciones.length },
    };
  }
}
