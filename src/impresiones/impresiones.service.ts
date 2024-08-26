import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';

@Injectable()
export class ImpresionesService {
  constructor(
    @InjectRepository(Pedido, 'impresionesConnection')
    private readonly pedidoRepository: Repository<Pedido>,
  ) {}

//   async findAll(params: {
//     size: number;
//     page: number;
//     dateStart?: string;
//     dateEnd?: string;
//     search?: string;
//     orderBy?: 1 | -1;
//   }): Promise<any> {
//     const { size, page, dateStart, dateEnd, search, orderBy } = params;

//     const query = this.pedidoRepository.createQueryBuilder('pedido');

//     if (dateStart) {
//       query.andWhere('pedido.created_at >= :dateStart', { dateStart });
//     }

//     if (dateEnd) {
//       query.andWhere('pedido.created_at <= :dateEnd', { dateEnd });
//     }

//     if (search) {
//       query.andWhere('pedido.nombre LIKE :search OR pedido.correo LIKE :search', { search: `%${search}%` });
//     }

//     if (orderBy) {
//       const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
//       query.orderBy('pedido.created_at', orderDirection);
//     }

//     query.skip((page - 1) * size).take(size);

//     const [result, total] = await query.getManyAndCount();

//     const totalAmountQuery = this.pedidoRepository.createQueryBuilder('pedido')
//       .select('SUM(pedido.total)', 'total');
    
//     if (dateStart) {
//       totalAmountQuery.andWhere('pedido.created_at >= :dateStart', { dateStart });
//     }

//     if (dateEnd) {
//       totalAmountQuery.andWhere('pedido.created_at <= :dateEnd', { dateEnd });
//     }

//     const totalAmountResult = await totalAmountQuery.getRawOne();
//     const totalAmount = totalAmountResult.total || 0;

//     return {
//       meta: {
//         total,
//         page,
//         size,
//         totalAmount,
//       },
//       data: result.map((pedido: Pedido) => ({
//         id: pedido.id,
//         attributes: {
//           numero_pedido: pedido.id,
//           cliente: pedido.nombre,
//           productos: pedido.carrito, // Aquí puedes ajustar cómo se muestran los productos
//           total: pedido.total,
//           correo: pedido.correo,
//           fecha: pedido.created_at,
//           status: pedido.estatus_pedido,
//         },
//       })),
//     };
//   }


  async todas(): Promise<Pedido[]> {
    return this.pedidoRepository.find();
  }


  private validateDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }





  async findAll(params: {
    size: number;
    page: number;
    dateStart?: string;
    dateEnd?: string;
    search?: string;
    orderBy?: 1 | -1;
  }): Promise<any> {
    const { size, page, dateStart, dateEnd, search, orderBy } = params;
  
    const query = this.pedidoRepository.createQueryBuilder('pedido')
      .where('pedido.estatus_pedido = :status', { status: 'pago exitoso' });
  
    // Aplicar filtro de fecha de inicio
    if (dateStart) {
      const dateStartUTC = new Date(dateStart);
      dateStartUTC.setUTCHours(0, 0, 0, 0); // Inicio del día en UTC
      query.andWhere('pedido.created_at >= :dateStart', { dateStart: dateStartUTC.toISOString() });
    }
  
    // Aplicar filtro de fecha de finalización
    if (dateEnd) {
      const dateEndUTC = new Date(dateEnd);
      dateEndUTC.setUTCHours(23, 59, 59, 999); // Fin del día en UTC
      query.andWhere('pedido.created_at <= :dateEnd', { dateEnd: dateEndUTC.toISOString() });
    }
  
    // Aplicar filtro de búsqueda
    if (search) {
      query.andWhere('pedido.correo LIKE :search OR pedido.nombre LIKE :search', { search: `%${search}%` });
    }
  
    // Aplicar ordenamiento
    if (orderBy) {
      const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
      query.orderBy('pedido.created_at', orderDirection);
    }
  
    // Aplicar paginación
    query.skip((page - 1) * size).take(size);
  
    console.log('Generated SQL:', query.getSql());
  
    const [result, total] = await query.getManyAndCount();
  
    // Calcular el monto total
    const totalAmount = result.reduce((sum, pedido) => sum + pedido.total, 0);
  
    return {
      meta: {
        total,
        page,
        size,
        totalAmount,
      },
      data: result.map((pedido: any) => {
        let productos = '';
  
        try {
          const carrito = pedido.carrito;
          productos = carrito.map((item: any) => item.personalizacion.tipoImpresionValor).join(', ');
        } catch (error) {
          console.error('Error parsing carrito:', error);
        }
  
        return {
          id: pedido.id,
          attributes: {
            numero_pedido: pedido.id,
            cliente: pedido.nombre,
            productos,
            total: pedido.total,
            correo: pedido.correo,
            fecha: pedido.created_at,
            status: pedido.estatus_pedido,
          },
        };
      }),
    };
  }
  
  
  
  
  
  
  
  
  
  
  
  

  async findAllUsers(params: {
    size: number;
    page: number;
    search?: string;
    orderBy?: 1 | -1;
  }): Promise<any> {
    const { size, page, search, orderBy } = params;
  
    // Subconsulta para obtener la fecha de registro más temprana para cada email
    const subquery = this.pedidoRepository.createQueryBuilder('subPedido')
      .select('MIN(subPedido.created_at)', 'fechaRegistro')
      .where('subPedido.correo = pedido.correo')
      .getQuery();
  
    // Consulta principal usando la subconsulta
    let query = this.pedidoRepository.createQueryBuilder('pedido')
      .select([
        'pedido.correo AS correo',
        'pedido.nombre AS nombre',
        `(${subquery}) AS fechaRegistro`
      ])
      .groupBy('pedido.correo, pedido.nombre');
  
    if (search) {
      query.andWhere('pedido.correo LIKE :search OR pedido.nombre LIKE :search', {
        search: `%${search}%`,
      });
    }
  
    if (orderBy) {
      const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
      query.orderBy('fechaRegistro', orderDirection);
    }
  
    query.skip((page - 1) * size).take(size);
  
    const result = await query.getRawMany();
  
    // Total number of unique emails
    const totalQuery = this.pedidoRepository.createQueryBuilder('pedido')
      .select('COUNT(DISTINCT pedido.correo)', 'count')
      .getRawOne();
  
    const total = (await totalQuery).count;
  
    return {
      meta: {
        total: parseInt(total, 10),
        page,
        size,
      },
      data: result.map((pedido, index) => ({
        id: index + 1,
        attributes: {
          correo: pedido.correo,
          nombre: pedido.nombre,
          fechaRegistro: pedido.fechaRegistro,
        },
      })),
    };
  }



  async findAllWithoutDateFilters(params: {
    size: number;
    page: number;
    search?: string;
    orderBy?: 1 | -1;
  }): Promise<any> {
    const { size, page, search, orderBy } = params;
  
    console.log('Request parameters:', { size, page, search, orderBy });
  
    // Construir consulta sin filtros de fecha
    const query = this.pedidoRepository.createQueryBuilder('pedido')
      .where('pedido.estatus_pedido = :status', { status: 'pago exitoso' });
  
    // Filtro de búsqueda
    if (search) {
      query.andWhere('pedido.correo LIKE :search OR pedido.nombre LIKE :search', { search: `%${search}%` });
    }
  
    // Ordenamiento
    if (orderBy) {
      const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
      query.orderBy('pedido.created_at', orderDirection);
    }
  
    // Paginación
    query.skip((page - 1) * size).take(size);
  
    console.log('Generated SQL:', query.getSql());
  
    const [result, total] = await query.getManyAndCount();
  
    console.log('Obtained records:', JSON.stringify(result, null, 2));
  
    // Calcular el monto total
    const totalAmount = result.reduce((sum, pedido) => sum + pedido.total, 0);
    console.log('Total Amount Calculated:', totalAmount);
  
    // Devolver los resultados
    return {
      meta: {
        total,
        page,
        size,
        totalAmount,
      },
      data: result.map((pedido: any) => {
        let productos = '';
  
        try {
          const carrito = pedido.carrito;
          productos = carrito.map((item: any) => item.personalizacion.tipoImpresionValor).join(', ');
          console.log('Parsed Carrito:', carrito);
        } catch (error) {
          console.error('Error parsing carrito:', error);
        }
  
        return {
          id: pedido.id,
          attributes: {
            numero_pedido: pedido.id,
            cliente: pedido.nombre,
            productos,
            total: pedido.total,
            correo: pedido.correo,
            fecha: pedido.created_at,
            status: pedido.estatus_pedido,
          },
        };
      }),
    };
  }
  
  
}
