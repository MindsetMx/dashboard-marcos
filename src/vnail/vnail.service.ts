import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Compra } from './entities/compra.entity';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class VnailService {
  constructor(
    @InjectRepository(Compra, 'vnailConnection')
    private compraRepository: Repository<Compra>,
    @InjectRepository(Usuario, 'vnailConnection')
    private userRepository: Repository<Usuario>,

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

    const query = this.compraRepository.createQueryBuilder('compra');

    if (dateStart) {
      query.andWhere('compra.created_at >= :dateStart', { dateStart });
    }

    if (dateEnd) {
      query.andWhere('compra.created_at <= :dateEnd', { dateEnd });
    }

    if (search) {
      query.andWhere('compra.user_id = :search OR compra.email LIKE :search', { search: `%${search}%` });
    }

    if (orderBy) {
      const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
      query.orderBy('compra.created_at', orderDirection);
    }

    query.skip((page - 1) * size).take(size);

    const [result, total] = await query.getManyAndCount();

    return {
      meta: {
        total,
        page,
        size,
      },
      data: result.map((compra:any) => ({
        id: compra.id,
        attributes: {
          numero_pedido: compra.id,
          cliente: compra.direccion.nombre,
          productos: Object.values(compra.resumen).map((p: any) => p.name).join(', '),
          total: compra.total,
          correo: compra.email,
          fecha: compra.created_at,
          status: compra.estatus_id,
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
  
}
