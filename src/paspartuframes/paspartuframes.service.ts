import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Compra } from './entities/compra.entity';

@Injectable()
export class PaspartuframesService {
  constructor(
    @InjectRepository(User, 'paspartuframesConnection')
    private readonly userRepository: Repository<User>,
    @InjectRepository(Compra, 'paspartuframesConnection')
    private readonly compraRepository: Repository<Compra>,
  ) {}

  // Métodos de servicio para manejar usuarios
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

  async findAll(params: {
    size: number;
    page: number;
    dateStart?: string;
    dateEnd?: string;
    search?: string;
    orderBy?: 1 | -1;
  }): Promise<any> {
    const { size, page, dateStart, dateEnd, search, orderBy } = params;

    const query = this.compraRepository.createQueryBuilder('compra');

    query.andWhere('compra.id >= :minId', { minId: 77 });

    if (dateStart) {
      console.log(`Filtering by start date: ${dateStart}`);
      query.andWhere('compra.fecha >= :dateStart', { dateStart });
    }

    if (dateEnd) {
      console.log(`Filtering by end date: ${dateEnd}`);
      query.andWhere('compra.fecha <= :dateEnd', { dateEnd });
    }

    if (search) {
      console.log(`Filtering by search: ${search}`);
      query.andWhere(
        'compra.correo LIKE :search',
        { search: `%${search}%` },
      );
    }

    if (orderBy) {
      const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
      console.log(`Ordering by fecha: ${orderDirection}`);
      query.orderBy('compra.fecha', orderDirection);
    }

    query.skip((page - 1) * size).take(size);

    console.log(`Generated SQL: ${query.getSql()}`);

    const [result, total] = await query.getManyAndCount();

    console.log(`Total results: ${total}`);
    console.log(`Result: ${JSON.stringify(result, null, 2)}`);

    return {
      meta: {
        total,
        page,
        size,
      },
      data: result.map(compra => ({
        id: compra.id,
        attributes: {
          numero_pedido: compra.id,
          cliente: compra.nombre, // Asegúrate de que el nombre está disponible
          productos: JSON.parse(compra.productos).map(p => p.tipo_compra).join(', '),
          total: compra.total,
          correo: compra.correo,
          fecha: compra.fecha,
          status: compra.status,
        },
      })),
    };
  }

  async checkDates(): Promise<any> {
    const result = await this.compraRepository.createQueryBuilder('compra')
      .select(['compra.id', 'compra.fecha'])
      .getMany();
    
    console.log('Date Check Result:', result);
    return result;
  }

  async getSalesByProductType(params: {
    page?: number;
    size?: number;
    orderBy: 1 | -1;
    dateStart?: string;
    dateEnd?: string;
  }): Promise<any> {
    const { page, size, orderBy, dateStart, dateEnd } = params;

    const query = this.compraRepository.createQueryBuilder('compra');

    query.andWhere('compra.id >= :minId', { minId: 77 });

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
      productos.forEach((producto: { tipo_compra: string }) => {
        if (!acc[producto.tipo_compra]) {
          acc[producto.tipo_compra] = 0;
        }
        acc[producto.tipo_compra]++;
      });
      return acc;
    }, {});

    return Object.keys(productTypeCounts).map(productType => ({
      productType,
      count: productTypeCounts[productType],
    }));
  }

  async getAllProductCategories(): Promise<any> {
    const results = await this.compraRepository.createQueryBuilder('compra')
      .select(['compra.productos'])
      .where('compra.id >= :minId', { minId: 77 })
      .getMany();

    const categories = new Set<string>();

    results.forEach(compra => {
      const productos = JSON.parse(compra.productos);
      productos.forEach((producto: { tipo_compra: string }) => {
        categories.add(producto.tipo_compra);
      });
    });

    return Array.from(categories);
  }


  async getTopMolduras(params: {
    page?: number;
    size?: number;
    orderBy: 1 | -1;
    dateStart?: string;
    dateEnd?: string;
  }): Promise<any> {
    const { page, size, orderBy, dateStart, dateEnd } = params;

    const query = this.compraRepository.createQueryBuilder('compra');

    query.andWhere('compra.id >= :minId', { minId: 77 });

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
      productos.forEach((producto: { tipo_compra: string, marco: string }) => {
        if (producto.tipo_compra === 'Impresión y Marco' || producto.tipo_compra === 'marcos para fotos') {
          if (!acc[producto.marco]) {
            acc[producto.marco] = 0;
          }
          acc[producto.marco]++;
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




    // Métodos de servicio para manejar compras
    async findAllCompras(): Promise<Compra[]> {
        return this.compraRepository.find();
      }


}
