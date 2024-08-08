import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Compra } from './entities/compra.entity';
import { User } from './entities/user.entity';

@Injectable()
export class FrameitService {
  constructor(
    @InjectRepository(Compra)
    private orderRepository: Repository<Compra>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}


  // async findAll(params: {
  //   size: number;
  //   page: number;
  //   dateStart?: string;
  //   dateEnd?: string;
  //   search?: string;
  //   orderBy?: 1 | -1;
  // }): Promise<any> {
  //   const { size, page, dateStart, dateEnd, search, orderBy } = params;
  
  //   // Calcular el monto total de todas las ventas en el rango de fechas
  //   const totalAmountQuery = this.orderRepository.createQueryBuilder('compra')
  //     .select('SUM(compra.total)', 'total')
  //     .where('compra.fecha >= :dateStart', { dateStart })
  //     .andWhere('compra.fecha <= :dateEnd', { dateEnd });
  
  //   const totalAmountResult = await totalAmountQuery.getRawOne();
  //   const totalAmount = totalAmountResult.total || 0;
  
  //   const query = this.orderRepository.createQueryBuilder('compra');
  
  //   if (dateStart) {
  //     query.andWhere('compra.fecha >= :dateStart', { dateStart });
  //   }
  
  //   if (dateEnd) {
  //     query.andWhere('compra.fecha <= :dateEnd', { dateEnd });
  //   }
  
  //   if (search) {
  //     query.andWhere(
  //       'compra.nombreC LIKE :search OR compra.correo LIKE :search',
  //       { search: `%${search}%` },
  //     );
  //   }
  
  //   if (orderBy) {
  //     const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
  //     query.orderBy('compra.fecha', orderDirection);
  //   }
  
  //   query.skip((page - 1) * size).take(size);
  
  //   const [result, total] = await query.getManyAndCount();
  
  //   return {
  //     meta: {
  //       total,
  //       page,
  //       size,
  //       totalAmount, // Agregar el monto total de las ventas al metadato
  //     },
  //     data: result.map(compra => ({
  //       id: compra.id,
  //       attributes: {
  //         numero_pedido: compra.id,
  //         cliente: compra.nombreC,
  //         productos: JSON.parse(compra.productos).map(p => p.tipoCompra).join(', '),
  //         total: compra.total,
  //         correo: compra.correo,
  //         fecha: compra.fecha,
  //         status: compra.status,
  //       },
  //     })),
  //   };
  // }


  async findAll(params: {
    size: number;
    page: number;
    dateStart?: string;
    dateEnd?: string;
    search?: string;
    orderBy?: 1 | -1;
  }): Promise<any> {
    const { size, page, dateStart, dateEnd, search, orderBy } = params;
  
    // Calcular el monto total de todas las ventas en el rango de fechas solo para los estados permitidos
    const totalAmountQuery = this.orderRepository.createQueryBuilder('compra')
      .select('SUM(compra.total)', 'total')
      .where('compra.status IN (:...statusIds)', { statusIds: ['Fabrica', 'Enviado', 'Entregado'] });
  
    if (dateStart) {
      totalAmountQuery.andWhere('compra.fecha >= :dateStart', { dateStart });
    }
  
    if (dateEnd) {
      totalAmountQuery.andWhere('compra.fecha <= :dateEnd', { dateEnd });
    }
  
    const totalAmountResult = await totalAmountQuery.getRawOne();
    const totalAmount = totalAmountResult.total || 0;
  
    const query = this.orderRepository.createQueryBuilder('compra');
  
    if (dateStart) {
      query.andWhere('compra.fecha >= :dateStart', { dateStart });
    }
  
    if (dateEnd) {
      query.andWhere('compra.fecha <= :dateEnd', { dateEnd });
    }
  
    if (search) {
      query.andWhere(
        'compra.nombreC LIKE :search OR compra.correo LIKE :search',
        { search: `%${search}%` },
      );
    }
  
    if (orderBy) {
      const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
      query.orderBy('compra.fecha', orderDirection);
    }
  
    query.skip((page - 1) * size).take(size);
  
    const [result, total] = await query.getManyAndCount();
  
    console.log('Resultados obtenidos:', JSON.stringify(result, null, 2));
  
    return {
      meta: {
        total,
        page,
        size,
        totalAmount, // Agregar el monto total de las ventas al metadato
      },
      data: result.map(compra => ({
        id: compra.id,
        attributes: {
          numero_pedido: compra.id,
          cliente: compra.nombreC,
          productos: JSON.parse(compra.productos).map(p => p.tipoCompra).join(', '),
          total: compra.total,
          correo: compra.correo,
          fecha: compra.fecha,
          status: compra.status,
        },
      })),
    };
  }
  
  

  async findAllUsers(params: {
    size: number;
    page: number;
    search?: string;
    orderBy?: 1 | -1;
  }): Promise<any> {
    const { size, page, search, orderBy } = params;
  
    const query = this.userRepository.createQueryBuilder('user');
  
    if (search) {
      query.andWhere('user.name LIKE :search OR user.email LIKE :search', {
        search: `%${search}%`,
      });
    }
  
    if (orderBy) {
      const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
      query.orderBy('user.created_at', orderDirection);
    }
  
    query.skip((page - 1) * size).take(size);
  
    const [result, total] = await query.getManyAndCount();
  
    return {
      meta: {
        total,
        page,
        size,
      },
      data: result.map(user => ({
        id: user.id,
        attributes: {
          correo: user.email,
          nombre: user.name,
          fechaRegistro: user.created_at,
        },
      })),
    };
  }

  async getSalesByProductType(params: {
    page?: number;
    size?: number;
    orderBy: 1 | -1;
    dateStart?: string;
    dateEnd?: string;
  }): Promise<any> {
    const { page, size, orderBy, dateStart, dateEnd } = params;

    const query = this.orderRepository.createQueryBuilder('compra');

    if (dateStart) {
      query.andWhere('compra.fecha >= :dateStart', { dateStart });
    }
    if (dateEnd) {
      query.andWhere('compra.fecha <= :dateEnd', { dateEnd });
    }

    if (page && size) {
      query.skip((page - 1) * size).take(size);
    }

    const results = await query.getMany();

    const productTypeCounts = results.reduce((acc, compra) => {
      const productos = JSON.parse(compra.productos);
      productos.forEach((producto: { tipoCompra: string }) => {
        const productType = this.mapProductType(producto.tipoCompra);
        if (!acc[productType]) {
          acc[productType] = 0;
        }
        acc[productType]++;
      });
      return acc;
    }, {});

    return Object.keys(productTypeCounts).map(productType => ({
      productType,
      count: productTypeCounts[productType],
    }));
  }

  async getTopMolduras(params: {
    page?: number;
    size?: number;
    orderBy: 1 | -1;
    dateStart?: string;
    dateEnd?: string;
  }): Promise<any> {
    const { page, size, orderBy, dateStart, dateEnd } = params;

    console.log('orderBy in service:', orderBy);

    const query = this.orderRepository.createQueryBuilder('compra');

    if (dateStart) {
      query.andWhere('compra.fecha >= :dateStart', { dateStart });
    }
    if (dateEnd) {
      query.andWhere('compra.fecha <= :dateEnd', { dateEnd });
    }

    if (page && size) {
      query.skip((page - 1) * size).take(size);
    }

    const results = await query.getMany();

    const molduraCounts = results.reduce((acc, compra) => {
      const productos = JSON.parse(compra.productos);
      productos.forEach((producto: { tipoCompra: string, moldura: string }) => {
        const productType = this.mapProductType(producto.tipoCompra);
        if (productType === 'MARCO A DOMICILIO' || productType === 'IMPRIMIR + MARCO') {
          if (!acc[producto.moldura]) {
            acc[producto.moldura] = 0;
          }
          acc[producto.moldura]++;
        }
      });
      return acc;
    }, {});

    let sortedMolduras = Object.keys(molduraCounts).map(moldura => ({
      moldura,
      count: molduraCounts[moldura],
    }));

    console.log('Before sorting:', sortedMolduras);

    sortedMolduras.sort((a, b) => {
      const comparison = b.count - a.count;
      return orderBy === 1 ? comparison : -comparison;
    });

    console.log('After sorting:', sortedMolduras);

    return sortedMolduras;
  }

  private mapProductType(tipoCompra: string): string {
    switch (tipoCompra) {
      case 'FRAME IT':
      case 'MARCO A DOMICILIO':
        return 'MARCO A DOMICILIO';
      case 'PRINT + FRAME':
      case 'IMPRIMIR + MARCO':
        return 'IMPRIMIR + MARCO';
      case 'PRODUCTOS TERMINADOS':
        return 'PRODUCTOS TERMINADOS';
      case 'FRAME+':
        return 'FRAME+';
      default:
        return 'OTROS';
    }
  }
}
