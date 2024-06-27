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




    // Métodos de servicio para manejar compras
    async findAllCompras(): Promise<Compra[]> {
        return this.compraRepository.find();
      }


}
