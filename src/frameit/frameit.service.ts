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


  async findAll(params: {
    size: number;
    page: number;
    dateStart?: string;
    dateEnd?: string;
    search?: string;
    orderBy?: 1 | -1;
  }): Promise<any> {
    const { size, page, dateStart, dateEnd, search, orderBy } = params;
  
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
        { search: `%${search}%` }
      );
    }
  
    if (orderBy) {
      const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
      query.orderBy('compra.fecha', orderDirection);
    }
  
    query.skip((page - 1) * size).take(size);
  
    const [result, total] = await query.getManyAndCount();
  
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
  

  findOne(id: number): Promise<Compra> {
    return this.orderRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }


  // Métodos para "User"
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
  

  findOneUser(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async removeUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
