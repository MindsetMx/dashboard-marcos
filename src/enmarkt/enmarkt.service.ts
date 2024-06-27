import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';

@Injectable()
export class EnmarktService {
  constructor(
    @InjectRepository(Venta, 'enmarktConnection')
    private readonly ventaRepository: Repository<Venta>,
  ) {}


  async findAll(params: {
    size: number;
    page: number;
    dateStart?: string;
    dateEnd?: string;
    search?: string;
    orderBy?: 1 | -1;
  }): Promise<any> {
    const { size, page, dateStart, dateEnd, search, orderBy } = params;

    // Calcular el monto total de todas las ventas en el rango de fechas
    const totalAmountQuery = this.ventaRepository.createQueryBuilder('venta')
      .select('SUM(venta.total)', 'total')
      .where('venta.fechaPedido >= :dateStart', { dateStart })
      .andWhere('venta.fechaPedido <= :dateEnd', { dateEnd });

    const totalAmountResult = await totalAmountQuery.getRawOne();
    const totalAmount = totalAmountResult.total || 0;

    const query = this.ventaRepository.createQueryBuilder('venta');

    if (dateStart) {
      query.andWhere('venta.fechaPedido >= :dateStart', { dateStart });
    }

    if (dateEnd) {
      query.andWhere('venta.fechaPedido <= :dateEnd', { dateEnd });
    }

    if (search) {
      query.andWhere(
        'venta.cliente LIKE :search OR venta.email LIKE :search',
        { search: `%${search}%` },
      );
    }

    if (orderBy) {
      const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
      query.orderBy('venta.fechaPedido', orderDirection);
    }

    query.skip((page - 1) * size).take(size);

    const [result, total] = await query.getManyAndCount();

    return {
      meta: {
        total,
        page,
        size,
        totalAmount, // Agregar el monto total de las ventas al metadato
      },
      data: result.map(venta => ({
        id: venta.id,
        attributes: {
          numero_pedido: venta.id,
          cliente: venta.cliente,
          productos: JSON.parse(venta.productos).map(p => p.tipoCompra).join(', '),
          total: venta.total,
          correo: venta.email,
          fecha: venta.fechaPedido,
          status: venta.estadoProducto,
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

    const query = this.ventaRepository.createQueryBuilder('venta');

    if (dateStart) {
      query.andWhere('venta.fechaPedido >= :dateStart', { dateStart });
    }
    if (dateEnd) {
      query.andWhere('venta.fechaPedido <= :dateEnd', { dateEnd });
    }

    if (page && size) {
      query.skip((page - 1) * size).take(size);
    }

    const results = await query.getMany();

    const productTypeCounts = results.reduce((acc, venta) => {
      const productos = JSON.parse(venta.productos);
      productos.forEach((producto: { tipoCompra: string }) => {
        const productType = producto.tipoCompra;
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

  async findAllUsers(params: {
    size: number;
    page: number;
    search?: string;
    orderBy?: 1 | -1;
  }): Promise<any> {
    const { size, page, search, orderBy } = params;
  
    // Subconsulta para obtener la fecha de registro más temprana para cada email
    const subquery = this.ventaRepository.createQueryBuilder('subVenta')
      .select('MIN(subVenta.fechaPedido)', 'fechaRegistro')
      .where('subVenta.email = venta.email')
      .getQuery();
  
    // Consulta principal usando la subconsulta
    let query = this.ventaRepository.createQueryBuilder('venta')
      .select([
        'venta.email AS email',
        'venta.cliente AS cliente',
        `(${subquery}) AS fechaRegistro`
      ])
      .groupBy('venta.email, venta.cliente');
  
    if (search) {
      query.andWhere('venta.email LIKE :search', {
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
    const totalQuery = this.ventaRepository.createQueryBuilder('venta')
      .select('COUNT(DISTINCT venta.email)', 'count')
      .getRawOne();
  
    const total = (await totalQuery).count;
  
    return {
      meta: {
        total: parseInt(total, 10),
        page,
        size,
      },
      data: result.map((venta, index) => ({
        id: index + 1,
        attributes: {
          correo: venta.email,
          nombre: venta.cliente,
          fechaRegistro: venta.fechaRegistro,
        },
      })),
    };
  }
  
  async getTopMolduras(params: {
    page?: number;
    size?: number;
    orderBy: 1 | -1;
    dateStart?: string;
    dateEnd?: string;
  }): Promise<any> {
    const { page, size, orderBy, dateStart, dateEnd } = params;
  
  
    const query = this.ventaRepository.createQueryBuilder('venta');
  
    if (dateStart) {
      query.andWhere('venta.fechaPedido >= :dateStart', { dateStart });
    }
    if (dateEnd) {
      query.andWhere('venta.fechaPedido <= :dateEnd', { dateEnd });
    }
  
    if (page && size) {
      query.skip((page - 1) * size).take(size);
    }
  
    const results = await query.getMany();
  
    const molduraCounts = results.reduce((acc, venta) => {
      const productos = JSON.parse(venta.productos);
      productos.forEach((producto: { tipoCompra: string, moldura: string }) => {
        if (['Enmarca', 'MARCO SIN FOTO', 'MARCO CON FOTO'].includes(producto.tipoCompra)) {
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
  
  
    sortedMolduras.sort((a, b) => {
      const comparison = b.count - a.count;
      return orderBy === 1 ? comparison : -comparison;
    });
  
  
    return sortedMolduras;
  }
  
  
  
  
  
  
  
  

  async analyzeProductCategories(): Promise<any> {
    const ventas = await this.ventaRepository.find();

    const categories = new Set<string>();

    ventas.forEach(venta => {
      const productos = JSON.parse(venta.productos);
      productos.forEach(producto => {
        categories.add(producto.tipoCompra);
      });
    });

    return Array.from(categories);
  }


}
